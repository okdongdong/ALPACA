package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.*;
import com.ssafy.alpaca.api.response.*;
import com.ssafy.alpaca.common.exception.UnAuthorizedException;
import com.ssafy.alpaca.common.util.ConvertUtil;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.common.util.RandomCodeUtil;
import com.ssafy.alpaca.db.document.Chat;
import com.ssafy.alpaca.db.document.Notification;
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
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
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
    private final NotificationRepository notificationRepository;

    public Study getStudyById(Long id) {
        return studyRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );
    }

    private User checkUserById(Long id) {
        return userRepository.findById(id).orElseThrow(
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

    public StudyListRes createStudy(User user, StudyReq studyReq) {
        if (99 < myStudyRepository.countAllByUser(user)) {
            throw new IllegalArgumentException(ExceptionUtil.TOO_MANY_STUDIES);
        }

        if (11 < studyReq.getMemberIdList().size()) {
            throw new IllegalArgumentException(ExceptionUtil.TOO_MANY_MEMBERS);
        }
        Study study = studyRepository.save(
                Study.builder()
                        .title(studyReq.getTitle())
                        .info(studyReq.getInfo())
                        .build()
        );

        studyRepository.save(study);
        MyStudy myStudy = myStudyRepository.save(
                MyStudy.builder()
                        .isRoomMaker(true)
                        .user(user)
                        .study(study)
                        .build()
        );
        myStudyRepository.save(myStudy);
        List<String> profileImg = new ArrayList<>();
        profileImg.add(convertUtil.convertByteArrayToString(user.getProfileImg()));
        return StudyListRes.builder()
                .id(study.getId())
                .title(study.getTitle())
                .pinnedTime(myStudy.getPinnedTime())
                .profileImgList(profileImg)
                .build();
    }

    public void setPin(User user, Long id) {
        Study study = getStudyById(id);
        MyStudy myStudy = checkMyStudyByUserAndStudy(user, study);
        if (myStudy.getPinnedTime().getYear() == 1) {
            myStudy.setPinnedTime(LocalDateTime.now());
            myStudyRepository.save(myStudy);
        } else {
            myStudy.setPinnedTime(LocalDateTime.of(1, 1, 1, 6, 0));
            myStudyRepository.save(myStudy);
        }
    }

    public StudyRes getStudy(User user, Long id, Integer offset){
        Study study = getStudyById(id);

        if (Boolean.TRUE.equals(!myStudyRepository.existsByUserAndStudy(user, study))) {
            throw new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND);
        }

        LocalDateTime localDateTime = LocalDateTime.now();
        LocalDateTime today = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        LocalDateTime thisMonth = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), 1, 0, 0);

        String offSet = convertUtil.getTime(offset);
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
                .info(study.getInfo())
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

    public List<StudyListRes> getStudyList(User user) {
        return myStudyRepository.findAllByUserOrderByPinnedTimeDesc(user)
                .stream().map(myStudy -> StudyListRes.builder()
                        .id(myStudy.getStudy().getId())
                        .title(myStudy.getStudy().getTitle())
                        .pinnedTime(myStudy.getPinnedTime())
                        .profileImgList(myStudyRepository.findTop4ByStudy(myStudy.getStudy()).stream().map(
                                        anotherMyStudy -> convertUtil.convertByteArrayToString(anotherMyStudy.getUser().getProfileImg()))
                                .collect(Collectors.toList()))
                        .build()).collect(Collectors.toList());
    }

    public List<ScheduleListRes> getScheduleList(User user, Integer year, Integer month, Integer day, Integer offset) {
        String offSet = convertUtil.getTime(offset);
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

    public List<ProblemListRes> getStudyProblem(User user, Long id){
        Study study = getStudyById(id);
        List<MyStudy> myStudy = myStudyRepository.findAllByStudy(study);
        List<Schedule> scheduleList = scheduleRepository.findAllByStudyIdOrderByStartedAtDesc(id);
        List<ToSolveProblem> problemList = new ArrayList<>();
        for(Schedule schedule:scheduleList){
            problemList.addAll(schedule.getToSolveProblems());
        }

        List<ProblemListRes> problemListRes = new ArrayList<>();
        Optional<Problem> problem;
        for (ToSolveProblem toSolveProblem : problemList) {
            problem = problemRepository.findByProblemNumber(toSolveProblem.getProblemNumber());
            if (problem.isEmpty()) {
                continue;
            }
            List<UserListRes> userListRes = new ArrayList<>();
            for (MyStudy ms : myStudy) {
                if (Boolean.TRUE.equals(codeRepository.existsByProblemNumberAndUserId(problem.get().getProblemNumber(), ms.getUser().getId()))) {
                    userListRes.add(UserListRes.builder()
                            .id(ms.getUser().getId())
                            .nickname(ms.getUser().getNickname())
                            .profileImg(convertUtil.convertByteArrayToString(ms.getUser().getProfileImg()))
                            .build());
                }
            }
            problemListRes.add(ProblemListRes.builder()
                    .id(toSolveProblem.getId())
                    .problemNumber(problem.get().getProblemNumber())
                    .title(problem.get().getTitle())
                    .level(problem.get().getLevel())
                    .isSolved(solvedProblemRepository.existsByUserAndProblemNumber(user, problem.get().getProblemNumber()))
                    .startedAt(toSolveProblem.getSchedule().getStartedAt())
                    .solvedMemberList(userListRes)
                    .build());
        }
        return problemListRes;
    }

    public void updateStudy(User user, Long id, StudyUpdateReq studyUpdateReq) {
        Study study = getStudyById(id);
        checkRoomMaker(user, study);

        study.setTitle(studyUpdateReq.getTitle());
        study.setInfo(studyUpdateReq.getInfo());
        studyRepository.save(study);
    }

    public void deleteStudy(User user, Long id) {
        Study study = getStudyById(id);
        checkRoomMaker(user, study);
        studyRepository.delete(study);
    }

    public void checkMember(User user, Long userId, Long studyId) {
        Study study = getStudyById(studyId);
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

    public void updateRoomMaker(User user, Long id, StudyMemberReq studyMemberReq) {
        Study study = getStudyById(id);
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

    public void deleteMember(User user, Long id, StudyMemberReq studyMemberReq) {
        Study study = getStudyById(id);
        User member = checkUserById(studyMemberReq.getMemberId());
        checkRoomMaker(user, study);

        if (user.getId().equals(member.getId())) {
            throw new NullPointerException(ExceptionUtil.USER_ID_DUPLICATE);
        }
        MyStudy memberStudy = checkMyStudyByUserAndStudy(member, study);
        myStudyRepository.delete(memberStudy);
    }

    public void deleteMeFromStudy(User user, Long id) {
        Study study = getStudyById(id);
        MyStudy myStudy = checkMyStudyByUserAndStudy(user, study);

        if (Boolean.TRUE.equals(myStudy.getIsRoomMaker())) {
            throw new UnAuthorizedException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        myStudyRepository.delete(myStudy);
    }

    public String createInviteCode(User user, Long id) {
        Study study = getStudyById(id);
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
        Study study = getStudyById(studyCode.getStudyId());
        MyStudy myStudy = myStudyRepository.findTopByStudyAndIsRoomMaker(study, true);

        return InviteInfoRes.builder()
                .roomMaker(myStudy.getUser().getNickname())
                .roomMakerProfileImg(convertUtil.convertByteArrayToString(myStudy.getUser().getProfileImg()))
                .title(study.getTitle())
                .info(study.getInfo())
                .build();
    }

    public void inviteUserCode(User user, StudyInviteReq studyInviteReq) {
        StudyCode studyCode = studyCodeRedisRepository.findById(studyInviteReq.getInviteCode()).orElseThrow(
                () -> new IllegalArgumentException(ExceptionUtil.INVITE_CODE_NOT_EXISTS)
        );
        Study study = getStudyById(studyCode.getStudyId());

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
        Study study = getStudyById(chatReq.getStudyId());

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

    public Slice<ChatRes> getChatListByStudy(Long studyId, String offsetId, Pageable pageable) {
        ObjectId objectId = new ObjectId(offsetId);
        Slice<Chat> chats = chatRepository.findPartByStudyId(objectId, studyId, pageable);

        return chats.map(chat -> ChatRes.builder()
                .userId(chat.getUserId())
                .content(chat.getContent())
                .timeStamp(chat.getTimeStamp())
                .build());
    }

    public StudyListRes joinStudy(User user, String id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isEmpty()) {
            throw  new IllegalArgumentException(ExceptionUtil.INVALID_INVITATION);
        }
        Study study = getStudyById(notification.get().getStudyId());

        if (Boolean.TRUE.equals(myStudyRepository.existsByUserAndStudy(user, study))) {
            notificationRepository.delete(notification.get());
            throw new NullPointerException(ExceptionUtil.USER_STUDY_DUPLICATE);
        } else {
            MyStudy newMyStudy = myStudyRepository.save(MyStudy.builder()
                    .isRoomMaker(false)
                    .user(user)
                    .study(study)
                    .build());
            List<MyStudy> myStudies = myStudyRepository.findTop4ByStudy(study);
            return StudyListRes.builder()
                    .id(study.getId())
                    .title(study.getTitle())
                    .pinnedTime(newMyStudy.getPinnedTime())
                    .profileImgList(myStudies.stream().map(
                                    myStudy -> convertUtil.convertByteArrayToString(myStudy.getUser().getProfileImg()))
                            .collect(Collectors.toList()))
                    .build();
        }
    }

    public void rejectStudy(User user, String id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isEmpty()) {
            throw new IllegalArgumentException(ExceptionUtil.INVALID_INVITATION);
        }
        if (!user.getId().equals(notification.get().getUserId())) {
            throw new UnAuthorizedException(ExceptionUtil.UNAUTHORIZED_USER);
        }
        notificationRepository.delete(notification.get());
    }

}
