package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.StudyInviteReq;
import com.ssafy.alpaca.api.request.StudyMemberReq;
import com.ssafy.alpaca.api.request.StudyReq;
import com.ssafy.alpaca.api.request.StudyUpdateReq;
import com.ssafy.alpaca.api.response.ScheduleListRes;
import com.ssafy.alpaca.api.response.StudyListRes;
import com.ssafy.alpaca.api.response.ProblemListRes;
import com.ssafy.alpaca.api.response.StudyRes;
import com.ssafy.alpaca.common.util.ConvertUtil;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.common.util.RandomCodeUtil;
import com.ssafy.alpaca.db.document.Code;
import com.ssafy.alpaca.db.entity.MyStudy;
import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.ToSolveProblem;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final CodeRepository codeRepository;

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

    public StudyRes getStudy(String username, Long id){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);

        Optional<MyStudy> optionalMyStudy = myStudyRepository.findByUserAndStudy(user, study);
        if (optionalMyStudy.isEmpty()) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        } else {
            LocalDateTime localDateTime = LocalDateTime.now();
            LocalDateTime thisMonth = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), 1, 0, 0).minusWeeks(1);
            LocalDateTime nextMonth = LocalDateTime.of(localDateTime.getYear(), localDateTime.getMonth(), 1, 0, 0).plusWeeks(2);
            List<Schedule> schedules = scheduleRepository.findAllByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtAsc(
                    study, thisMonth, nextMonth);
            List<MyStudy> myStudies = myStudyRepository.findAllByStudy(study);
            return StudyRes.builder()
                    .title(study.getTitle())
                    .info(study.getTitle())
                    .members(myStudies.stream().map(myStudy -> StudyRes.Member.builder()
                                    .userId(myStudy.getUser().getId())
                                    .nickname(myStudy.getUser().getNickname())
                                    .isRoomMaker(myStudy.getIsRoomMaker())
                                    .profileImg(convertUtil.convertByteArrayToString(myStudy.getUser().getProfileImg()))
                                    .build()).collect(Collectors.toList()))
                    .scheduleListRes(ScheduleListRes.of(schedules))
                    .build();
        }

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

    public Long createStudy(String username, StudyReq studyReq) throws IllegalAccessException {
        User user = checkUserByUsername(username);
        Study study = StudyReq.of(studyReq, user);

        if (12 < studyReq.getMemberIdList().size()) {
            throw new IllegalAccessException(ExceptionUtil.TOO_MANY_MEMBERS);
        }

        HashSet<Long> hashSet = new HashSet<>();
        List<MyStudy> myStudyList = new ArrayList<>();
        for (Long userId : studyReq.getMemberIdList()) {
            if (hashSet.contains(userId)) {
                continue;
            }
            hashSet.add(userId);

            myStudyList.add(MyStudy.builder()
                            .isRoomMaker(user.getId().equals(userId))
                            .user(checkUserById(userId))
                            .study(study)
                    .build());
        }

        studyRepository.save(study);
        myStudyRepository.saveAll(myStudyList);

        return study.getId();
    }

    public void updateRoomMaker(String username, Long id, StudyMemberReq studyMemberReq) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        User member = checkUserById(studyMemberReq.getMemberId());
        if (user.getId().equals(member.getId())) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.USER_ID_DUPLICATE);
        }

        MyStudy userStudy = myStudyRepository.findByUserAndStudy(user,study).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND));
        if (!userStudy.getIsRoomMaker()) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }
        MyStudy memberStudy = myStudyRepository.findByUserAndStudy(member,study).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND));

        userStudy.setIsRoomMaker(false);
        memberStudy.setIsRoomMaker(true);
        myStudyRepository.save(userStudy);
        myStudyRepository.save(memberStudy);
    }

    public void deleteMember(String username, Long id, StudyMemberReq studyMemberReq) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        User member = checkUserById(studyMemberReq.getMemberId());

        MyStudy userStudy = myStudyRepository.findByUserAndStudy(user,study).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND));;
        if (!userStudy.getIsRoomMaker()) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }
        if (user.getId().equals(member.getId())) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.USER_ID_DUPLICATE);
        }
        MyStudy memberStudy = myStudyRepository.findByUserAndStudy(member,study).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND));;
        myStudyRepository.delete(memberStudy);
    }

    public void deleteMeFromStudy(String username, Long id) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        MyStudy myStudy = myStudyRepository.findByUserAndStudy(user, study).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND));

        if (myStudy.getIsRoomMaker()) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        myStudyRepository.delete(myStudy);
    }

    public void deleteStudy(String username, Long id){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);

        MyStudy userStudy = myStudyRepository.findByUserAndStudy(user,study).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND));;
        if (!userStudy.getIsRoomMaker()) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }
        studyRepository.delete(study);
    }

    public void updateStudy(String username, Long id, StudyUpdateReq studyUpdateReq){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);

        MyStudy userStudy = myStudyRepository.findByUserAndStudy(user,study).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND));;
        if (!userStudy.getIsRoomMaker()) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        study.setTitle(studyUpdateReq.getTitle());
        study.setInfo(studyUpdateReq.getInfo());
        studyRepository.save(study);
    }

    public List<ProblemListRes> getStudyProblem(Long id){
        List<Schedule> scheduleList = scheduleRepository.findAllByStudyId(id);
        List<ToSolveProblem> problemList = new ArrayList<>();
        for(Schedule schedule:scheduleList){
            problemList.addAll(schedule.getToSolveProblems());
        }
        return problemList.stream().map(toSolveProblem -> ProblemListRes.builder()
                .id(toSolveProblem.getProblemId())
                .number(problemRepository.findById(toSolveProblem.getProblemId()).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND)).getNumber())
                .title(problemRepository.findById(toSolveProblem.getProblemId()).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND)).getTitle())
                .level(problemRepository.findById(toSolveProblem.getProblemId()).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND)).getLevel())
                .startedAt(toSolveProblem.getSchedule().getStartedAt())
                .solvedMemberList(ProblemListRes.of(solvedProblemRepository.findAllByProblemId(toSolveProblem.getProblemId())))
                .build()).collect(Collectors.toList());
    }

    public void inviteStudy(String username, Long id, StudyMemberReq studyMemberReq){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        User member = userRepository.findById(studyMemberReq.getMemberId()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
        MyStudy userStudy = myStudyRepository.findByUserAndStudy(user,study).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND));;
        if (!userStudy.getIsRoomMaker()) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }
        myStudyRepository.save(
                MyStudy.builder()
                        .isRoomMaker(false)
                        .user(member)
                        .study(study)
                        .build()
        );
    }

    public void inviteUserCode(String username, Long id, StudyInviteReq studyInviteReq){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        if (study.getInviteCode().isEmpty()){
            throw new IllegalArgumentException(ExceptionUtil.INVITE_CODE_NOT_EXISTS);
        }
        if (!studyInviteReq.getInviteCode().equals(study.getInviteCode())){
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

    public String createInviteCode(String username, Long id){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        MyStudy userStudy = myStudyRepository.findByUserAndStudy(user,study).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND));;
        if (!userStudy.getIsRoomMaker()) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }
        String inviteCode = RandomCodeUtil.getRandomCode();
        study.setInviteCode(inviteCode);
        return inviteCode;
    }

}
