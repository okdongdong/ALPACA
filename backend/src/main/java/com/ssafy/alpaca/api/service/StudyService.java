package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.*;
import com.ssafy.alpaca.api.response.*;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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

    private void checkRoomMaker(User user, Study study) throws IllegalAccessException {
        if (Boolean.TRUE.equals(myStudyRepository.existsByUserAndStudyAndIsRoomMaker(user, study, true))) {
            return;
        }
        throw new IllegalAccessException(ExceptionUtil.UNAUTHORIZED_USER);
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

    public void createPin(String username, Long id) {
        User user = checkUserByUsername(username);
        Study study = checkStudyById(id);
        MyStudy myStudy = checkMyStudyByUserAndStudy(user, study);
        if (myStudy.getPinnedTime().getYear() == 1) {
            myStudy.setPinnedTime(LocalDateTime.now());
        } else {
            myStudy.setPinnedTime(LocalDateTime.of(1, 1, 1, 6, 0));
        }
        myStudyRepository.save(myStudy);
    }

    public StudyRes getStudy(String username, Long id){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);

        if (Boolean.TRUE.equals(!myStudyRepository.existsByUserAndStudy(user, study))) {
            throw new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND);
        }

        LocalDateTime localDateTime = LocalDateTime.now();
        LocalDateTime today = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), localDateTime.getDayOfMonth(), 0, 0);
        Optional<Schedule> schedule = scheduleRepository.findByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(
                study, today, today.plusDays(1));

        LocalDateTime thisMonth = LocalDateTime
                .of(localDateTime.getYear(), localDateTime.getMonth(), 1, 0, 0)
                .minusDays(localDateTime.getDayOfWeek().getValue());
        List<Schedule> schedules = scheduleRepository.findAllByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtAsc(
                study, thisMonth, thisMonth.plusDays(42));

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

    public Page<StudyListRes> getMoreStudy(String username, Pageable pageable) {
        User user = checkUserByUsername(username);
        Page<MyStudy> myStudyList = myStudyRepository.findAllByUser(user, pageable);

        return myStudyList.map(myStudy -> StudyListRes.builder()
                .id(myStudy.getStudy().getId())
                .title(myStudy.getStudy().getTitle())
                .pinnedTime(myStudy.getPinnedTime())
                .profileImgList(
                        myStudyRepository.findAllByStudy(myStudy.getStudy())
                                .stream().map(ms -> convertUtil.convertByteArrayToString(ms.getUser().getProfileImg()))
                                .collect(Collectors.toList()))
                .build());
    }

    public List<ProblemListRes> getStudyProblem(Long id){
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
            problemListRes.add(ProblemListRes.builder()
                    .id(toSolveProblem.getId())
                    .problemNumber(problem.get().getProblemNumber())
                    .title(problem.get().getTitle())
                    .level(problem.get().getLevel())
                    .startedAt(toSolveProblem.getSchedule().getStartedAt())
                    .solvedMemberList(ProblemListRes.of(solvedProblemRepository.findAllByProblemNumber(toSolveProblem.getProblemNumber())))
                    .build());
        }
        return problemListRes;
//        return problemList.stream().map(toSolveProblem -> ProblemListRes.builder()
//                .id(toSolveProblem.getProblemId())
//                .number(problemRepository.findById(toSolveProblem.getProblemId()).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND)).getNumber())
//                .title(problemRepository.findById(toSolveProblem.getProblemId()).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND)).getTitle())
//                .level(problemRepository.findById(toSolveProblem.getProblemId()).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND)).getLevel())
//                .startedAt(toSolveProblem.getSchedule().getStartedAt())
//                .solvedMemberList(ProblemListRes.of(solvedProblemRepository.findAllByProblemId(toSolveProblem.getProblemId())))
//                .build()).collect(Collectors.toList());
    }

    public void updateStudy(String username, Long id, StudyUpdateReq studyUpdateReq) throws IllegalAccessException {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        checkRoomMaker(user, study);

        study.setTitle(studyUpdateReq.getTitle());
        study.setInfo(studyUpdateReq.getInfo());
        studyRepository.save(study);
    }

    public void deleteStudy(String username, Long id) throws IllegalAccessException {
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

    public void updateRoomMaker(String username, Long id, StudyMemberReq studyMemberReq) throws IllegalAccessException {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        User member = checkUserById(studyMemberReq.getMemberId());
        if (user.getId().equals(member.getId())) {
            throw new NullPointerException(ExceptionUtil.USER_ID_DUPLICATE);
        }

        MyStudy userStudy = checkMyStudyByUserAndStudy(user, study);
        if (Boolean.TRUE.equals(!userStudy.getIsRoomMaker())) {
            throw new IllegalAccessException(ExceptionUtil.UNAUTHORIZED_USER);
        }
        MyStudy memberStudy = checkMyStudyByUserAndStudy(member, study);

        userStudy.setIsRoomMaker(false);
        memberStudy.setIsRoomMaker(true);
        myStudyRepository.save(userStudy);
        myStudyRepository.save(memberStudy);
    }

    public void deleteMember(String username, Long id, StudyMemberReq studyMemberReq) throws IllegalAccessException {
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

    public void deleteMeFromStudy(String username, Long id) throws IllegalAccessException {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        MyStudy myStudy = checkMyStudyByUserAndStudy(user, study);

        if (Boolean.TRUE.equals(myStudy.getIsRoomMaker())) {
            throw new IllegalAccessException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        myStudyRepository.delete(myStudy);
    }

    public void inviteStudy(String username, Long id, StudyMemberReq studyMemberReq) throws IllegalAccessException {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        User member = checkUserById(studyMemberReq.getMemberId());
        checkRoomMaker(user, study);
        myStudyRepository.save(
                MyStudy.builder()
                        .isRoomMaker(false)
                        .user(member)
                        .study(study)
                        .build()
        );
    }

    public String createInviteCode(String username, Long id) throws IllegalAccessException {
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

    public Study getInviteInfo(String inviteCode) {
        StudyCode studyCode = studyCodeRedisRepository.findById(inviteCode).orElseThrow(
                () -> new IllegalArgumentException(ExceptionUtil.INVITE_CODE_NOT_EXISTS)
        );

        return checkStudyById(studyCode.getStudyId());
    }

    public void inviteUserCode(String username, Long id, StudyInviteReq studyInviteReq) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);

        if (Boolean.TRUE.equals(myStudyRepository.existsByUserAndStudy(user, study))) {
            throw new NullPointerException(ExceptionUtil.USER_STUDY_DUPLICATE);
        }

        Optional<StudyCode> studyCode = studyCodeRedisRepository.findById(studyInviteReq.getInviteCode());

        if (studyCode.isEmpty()) {
            throw new IllegalArgumentException(ExceptionUtil.INVITE_CODE_NOT_EXISTS);
        }
        if (Boolean.TRUE.equals(!study.getId().equals(studyCode.get().getStudyId()))){
            throw new IllegalArgumentException(ExceptionUtil.INVITE_CODE_INVALID);
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
