package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.*;
import com.ssafy.alpaca.api.response.*;
import com.ssafy.alpaca.common.exception.UnAuthorizedException;
import com.ssafy.alpaca.common.util.ConvertUtil;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.common.util.RandomCodeUtil;
import com.ssafy.alpaca.db.document.Chat;
import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.entity.MyStudy;
import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.ToSolveProblem;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.redis.InviteCode;
import com.ssafy.alpaca.db.redis.StudyCode;
import com.ssafy.alpaca.db.repository.*;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.core.aggregation.DateOperators;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudyService {

    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
    private final ConvertUtil convertUtil;
    private final ScheduleRepository scheduleRepository;
    private final MyStudyRepository myStudyRepository;
    private final SolvedProblemRepository solvedProblemRepository;
    private final ProblemRepository problemRepository;
    private final CodeRepository codeRepository;
    private final InviteCodeRedisRepository inviteCodeRedisRepository;
    private final StudyCodeRedisRepository studyCodeRedisRepository;
    private final ChatRepository chatRepository;

    private Study checkStudyById(Long id) {
        return studyRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );
    }

    private User checkUserById(Long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
    }

    private User checkUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
    }

    private MyStudy checkMyStudyByUserAndStudy(User user, Study study) {
        return myStudyRepository.findByUserAndStudy(user, study).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );
    }

    private void checkRoomMaker(User user, Study study) {
        if (Boolean.TRUE.equals(myStudyRepository.existsByUserAndStudyAndIsRoomMaker(user, study, true))) {
            return;
        }
        throw new UnAuthorizedException(ExceptionUtil.UNAUTHORIZED_USER);
    }

    public StudyListRes createStudy(String username, StudyReq studyReq) {
        User user = checkUserByUsername(username);
        if (12 < studyReq.getMemberIdList().size()) {
            throw new IllegalArgumentException(ExceptionUtil.TOO_MANY_MEMBERS);
        }
        Study study = StudyReq.of(studyReq);

        HashSet<Long> hashSet = new HashSet<>();
        List<MyStudy> myStudyList = new ArrayList<>();
        List<String> profileImgList = new ArrayList<>();
        for (Long userId : studyReq.getMemberIdList()) {
            if (hashSet.contains(userId)) {
                continue;
            }
            User addUser = checkUserById(userId);

            hashSet.add(userId);

            myStudyList.add(MyStudy.builder()
                    .isRoomMaker(user.getId().equals(userId))
                    .user(checkUserById(userId))
                    .study(study)
                    .build());

            profileImgList.add(convertUtil.convertByteArrayToString(addUser.getProfileImg()));
        }

        studyRepository.save(study);
        myStudyRepository.saveAll(myStudyList);
        return StudyListRes.builder()
                .id(study.getId())
                .title(study.getTitle())
                .pinnedTime(myStudyList.get(0).getPinnedTime())
                .profileImgList(profileImgList)
                .build();
    }

    public List<StudyListRes> setPin(String username, Long id, StudyPinReq studyPinReq) {
        User user = checkUserByUsername(username);
        Study study = checkStudyById(id);
        MyStudy myStudy = checkMyStudyByUserAndStudy(user, study);
        if (myStudy.getPinnedTime().getYear() == 1) {
            myStudy.setPinnedTime(LocalDateTime.now());
            myStudyRepository.save(myStudy);
        } else {
            myStudy.setPinnedTime(LocalDateTime.of(1, 1, 1, 6, 0));
            myStudyRepository.save(myStudy);

            return myStudyRepository.findByUserOrderByPinnedTimeDescLimitTo(user.getId(), studyPinReq.getLimit())
                    .stream().map(map -> StudyListRes.builder()
                            .id(map.getStudy().getId())
                            .title(map.getStudy().getTitle())
                            .pinnedTime(map.getPinnedTime())
                            .profileImgList(myStudyRepository.findTop4ByStudy(map.getStudy()).stream().map(
                                            anotherMyStudy -> convertUtil.convertByteArrayToString(anotherMyStudy.getUser().getProfileImg()))
                                    .collect(Collectors.toList()))
                            .build()).collect(Collectors.toList());

        }
        return null;
    }

    private String getTime(Integer offset) {
        if (offset == 0) {
            return "Z";
        } else {
            StringBuilder ret = new StringBuilder(0 < offset ? "-" : "+");
            int hour = Math.abs(offset/60);
            int minute = Math.abs(offset%60);
            String HOUR = String.format("%02d", hour);
            String MINUTE = String.format("%02d", minute);

            ret.append(HOUR);
            ret.append(":");
            ret.append(MINUTE);
            return ret.toString();
        }
    }

    public StudyRes getStudy(String username, Long id, Integer offset){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);

        if (Boolean.TRUE.equals(!myStudyRepository.existsByUserAndStudy(user, study))) {
            throw new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND);
        }

        LocalDateTime localDateTime = LocalDateTime.now();
        LocalDateTime today = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime thisMonth = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), 1, 0, 0);

        String offSet = getTime(offset);
        OffsetDateTime offsetToday = OffsetDateTime.of(today, ZoneOffset.of(offSet));
        Optional<Schedule> schedule = scheduleRepository.findByStudyAndStartedAtBetween(
                study, offsetToday, offsetToday.plusHours(24));

        OffsetDateTime offsetThisMonth = OffsetDateTime.of(thisMonth, ZoneOffset.of(offSet));
        if (offsetThisMonth.getDayOfWeek().getValue() < 7) {
            offsetThisMonth = offsetThisMonth.minusDays(offsetThisMonth.getDayOfWeek().getValue());
        }
        List<Schedule> schedules = scheduleRepository.findAllByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtAsc(
                study, offsetThisMonth, offsetThisMonth.plusWeeks(6));

        List<MyStudy> myStudies = myStudyRepository.findAllByStudy(study);

        Optional<Chat> optChat = chatRepository.findDistinctFirstByStudyIdOrderByIdDesc(id);
        return StudyRes.builder()
                .title(study.getTitle())
                .info(study.getTitle())
                .schedule(schedule.orElse(null))
                .members(myStudies.stream().map(myStudy -> StudyRes.Member.builder()
                                .userId(myStudy.getUser().getId())
                                .nickname(myStudy.getUser().getNickname())
                                .bojId(myStudy.getUser().getBojId())
                                .isRoomMaker(myStudy.getIsRoomMaker())
                                .profileImg(convertUtil.convertByteArrayToString(myStudy.getUser().getProfileImg()))
                                .build()).collect(Collectors.toList()))
                .scheduleListRes(ScheduleListRes.of(schedules))
                .offsetId(optChat.map(Chat::getId).orElse(null))
                .build();
    }

//    public Page<StudyListRes> getMoreStudy(String username, Pageable pageable) {
//        User user = checkUserByUsername(username);
//        Page<MyStudy> myStudyList = myStudyRepository.findAllByUser(user, pageable);
//
//        return myStudyList.map(myStudy -> StudyListRes.builder()
//                .id(myStudy.getStudy().getId())
//                .title(myStudy.getStudy().getTitle())
//                .pinnedTime(myStudy.getPinnedTime())
//                .profileImgList(
//                        myStudyRepository.findAllByStudy(myStudy.getStudy())
//                                .stream().map(ms -> convertUtil.convertByteArrayToString(ms.getUser().getProfileImg()))
//                                .collect(Collectors.toList()))
//                .build());
//    }

    public List<ScheduleListRes> getScheduleList(String username, Integer year, Integer month, Integer day, Integer offset) {
        User user = checkUserByUsername(username);
        String offSet = getTime(offset);
        List<Object[]> objects;
        if (day == null) {
            OffsetDateTime offsetDateTime = OffsetDateTime.of(year, month, 1, 0, 0, 0, 0, ZoneOffset.of(offSet));
            if (offsetDateTime.getDayOfWeek().getValue() < 7) {
                offsetDateTime = offsetDateTime.minusDays(offsetDateTime.getDayOfWeek().getValue());
            }
            objects = myStudyRepository.findScheduleListByUserId(user.getId(), offsetDateTime, offsetDateTime.plusWeeks(6));
        } else {
            OffsetDateTime offsetDateTime = OffsetDateTime.of(year, month, day, 0, 0, 0, 0, ZoneOffset.of(offSet));
            if (offsetDateTime.getDayOfWeek().getValue() < 7) {
                offsetDateTime = offsetDateTime.minusDays(offsetDateTime.getDayOfWeek().getValue());
            }
            objects = myStudyRepository.findScheduleListByUserId(user.getId(), offsetDateTime, offsetDateTime.plusDays(7));
        }
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");
        return objects.stream().map(object -> ScheduleListRes.builder()
                .id(Long.parseLong(object[0].toString()))
                .studyId(Long.parseLong(object[1].toString()))
                .studyTitle(object[2].toString())
                .startedAt(OffsetDateTime.of(LocalDateTime.parse(object[3].toString(), dateTimeFormatter), ZoneOffset.of(offSet)))
                .finishedAt(OffsetDateTime.of(LocalDateTime.parse(object[4].toString(), dateTimeFormatter), ZoneOffset.of(offSet)))
                .build()).collect(Collectors.toList());
    }

    public List<ProblemListRes> getStudyProblem(String username, Long id){
        User user = checkUserByUsername(username);
        Study study = checkStudyById(id);
        List<MyStudy> myStudy = myStudyRepository.findAllByStudy(study);
        List<Schedule> scheduleList = scheduleRepository.findAllByStudyId(id);
        List<ToSolveProblem> problemList = new ArrayList<>();
        for(Schedule schedule:scheduleList){
            problemList.addAll(schedule.getToSolveProblems());
        }

        List<ProblemListRes> problemListRes = new ArrayList<>();
        for (ToSolveProblem toSolveProblem : problemList) {
            Optional<Problem> problem = problemRepository.findByProblemNumber(toSolveProblem.getProblemNumber());
            if (problem.isEmpty()) {
                continue;
            }
            List<User> users = new ArrayList<>();
            for (MyStudy ms : myStudy) {
                if (codeRepository.existsByProblemNumberAndUserId(problem.get().getProblemNumber(), ms.getUser().getId())) {
                    users.add(ms.getUser());
                }
            }
            problemListRes.add(ProblemListRes.builder()
                    .id(toSolveProblem.getId())
                    .problemNumber(problem.get().getProblemNumber())
                    .title(problem.get().getTitle())
                    .level(problem.get().getLevel())
                    .isSolved(solvedProblemRepository.existsByUserAndProblemNumber(user, problem.get().getProblemNumber()))
                    .startedAt(toSolveProblem.getSchedule().getStartedAt())
                    .solvedMemberList(users)
                    .build());
        }
        return problemListRes;
    }

    public void updateStudy(String username, Long id, StudyUpdateReq studyUpdateReq) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        checkRoomMaker(user, study);

        study.setTitle(studyUpdateReq.getTitle());
        study.setInfo(studyUpdateReq.getInfo());
        studyRepository.save(study);
    }

    public void deleteStudy(String username, Long id) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        checkRoomMaker(user, study);
        studyRepository.delete(study);
    }

    public void checkMember(String username, Long userId, Long studyId) {
        Study study = checkStudyById(studyId);
        User user = checkUserByUsername(username);
        List<MyStudy> myStudies = myStudyRepository.findAllByStudy(study);

        boolean flagA = false;
        boolean flagB = false;
        for (MyStudy myStudy : myStudies) {
            if (myStudy.getUser().getId().equals(userId)) {
                flagA = true;
            }
            if (myStudy.getUser().getId().equals(user.getId())) {
                flagB = true;
            }
        }

        if (flagA && flagB) return;

        throw new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND_IN_STUDY);
    }

    public void updateRoomMaker(String username, Long id, StudyMemberReq studyMemberReq) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        User member = checkUserById(studyMemberReq.getMemberId());
        if (user.getId().equals(member.getId())) {
            throw new NullPointerException(ExceptionUtil.USER_ID_DUPLICATE);
        }

        MyStudy userStudy = checkMyStudyByUserAndStudy(user, study);
        if (Boolean.TRUE.equals(!userStudy.getIsRoomMaker())) {
            throw new UnAuthorizedException(ExceptionUtil.UNAUTHORIZED_USER);
        }
        MyStudy memberStudy = checkMyStudyByUserAndStudy(member, study);

        userStudy.setIsRoomMaker(false);
        memberStudy.setIsRoomMaker(true);
        myStudyRepository.save(userStudy);
        myStudyRepository.save(memberStudy);
    }

    public void deleteMember(String username, Long id, StudyMemberReq studyMemberReq) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        User member = checkUserById(studyMemberReq.getMemberId());
        checkRoomMaker(user, study);

        if (user.getId().equals(member.getId())) {
            throw new NullPointerException(ExceptionUtil.USER_ID_DUPLICATE);
        }
        MyStudy memberStudy = checkMyStudyByUserAndStudy(member, study);
        myStudyRepository.delete(memberStudy);
    }

    public void deleteMeFromStudy(String username, Long id) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        MyStudy myStudy = checkMyStudyByUserAndStudy(user, study);

        if (Boolean.TRUE.equals(myStudy.getIsRoomMaker())) {
            throw new UnAuthorizedException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        myStudyRepository.delete(myStudy);
    }

    public String createInviteCode(String username, Long id) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        checkRoomMaker(user, study);

        Optional<InviteCode> inviteCode = inviteCodeRedisRepository.findById(study.getId());
        if (inviteCode.isPresent()) {
            return inviteCode.get().getCode();
        }

        String newInviteCode = RandomCodeUtil.getRandomCode();
        inviteCodeRedisRepository.save(InviteCode.builder()
                                        .studyId(study.getId())
                                        .code(newInviteCode)
                                        .build());
        studyCodeRedisRepository.save(StudyCode.builder()
                                        .inviteCode(newInviteCode)
                                        .studyId(study.getId())
                                        .build());

        return newInviteCode;
    }

    public InviteInfoRes getInviteInfo(String inviteCode) {
        StudyCode studyCode = studyCodeRedisRepository.findById(inviteCode).orElseThrow(
                () -> new IllegalArgumentException(ExceptionUtil.INVITE_CODE_NOT_EXISTS)
        );
        Study study = checkStudyById(studyCode.getStudyId());
        MyStudy myStudy = myStudyRepository.findTopByStudyAndIsRoomMaker(study, true);

        return InviteInfoRes.builder()
                .roomMaker(myStudy.getUser().getNickname())
                .roomMakerProfileImg(convertUtil.convertByteArrayToString(myStudy.getUser().getProfileImg()))
                .title(study.getTitle())
                .info(study.getInfo())
                .build();
    }

    public void inviteUserCode(String username, StudyInviteReq studyInviteReq) {
        StudyCode studyCode = studyCodeRedisRepository.findById(studyInviteReq.getInviteCode()).orElseThrow(
                () -> new IllegalArgumentException(ExceptionUtil.INVITE_CODE_NOT_EXISTS)
        );
        Study study = checkStudyById(studyCode.getStudyId());
        User user = checkUserByUsername(username);

        if (Boolean.TRUE.equals(myStudyRepository.existsByUserAndStudy(user, study))) {
            throw new NullPointerException(ExceptionUtil.USER_STUDY_DUPLICATE);
        }

        myStudyRepository.save(
                MyStudy.builder()
                        .isRoomMaker(false)
                        .user(user)
                        .study(study)
                        .build()
        );
    }

    public ChatRes saveChat(ChatReq chatReq) {
        User user = checkUserById(chatReq.getUserId());
        Study study = checkStudyById(chatReq.getStudyId());

        Chat chat = chatRepository.save(Chat.builder()
                .userId(user.getId())
                .studyId(study.getId())
                .content(chatReq.getContent())
                .build());

        return ChatRes.builder()
                .userId(user.getId())
                .content(chat.getContent())
                .timeStamp(chat.getTimeStamp())
                .build();
    }

    public Slice<ChatListRes> getChatListByStudy(Long studyId, String offsetId, Pageable pageable) {
        ObjectId objectId = new ObjectId(offsetId);
        Slice<Chat> chats = chatRepository.findPartByStudyId(objectId, studyId, pageable);

        return chats.map(chat -> ChatListRes.builder()
                .userId(chat.getUserId())
                .content(chat.getContent())
                .timeStamp(chat.getTimeStamp())
                .build());
    }

}
