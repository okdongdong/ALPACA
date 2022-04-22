package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.StudyMemberReq;
import com.ssafy.alpaca.api.request.StudyReq;
import com.ssafy.alpaca.api.request.StudyUpdateReq;
import com.ssafy.alpaca.api.response.ScheduleListRes;
import com.ssafy.alpaca.api.response.StudyListRes;
import com.ssafy.alpaca.api.response.ProblemListRes;
import com.ssafy.alpaca.api.response.StudyRes;
import com.ssafy.alpaca.common.util.ConvertUtil;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.document.Schedule;
import com.ssafy.alpaca.db.document.Study;
import com.ssafy.alpaca.db.document.User;
import com.ssafy.alpaca.db.repository.ProblemRepository;
import com.ssafy.alpaca.db.repository.ScheduleRepository;
import com.ssafy.alpaca.db.repository.StudyRepository;
import com.ssafy.alpaca.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.DuplicateFormatFlagsException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudyService {

    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
    private final ConvertUtil convertUtil;
    private final ScheduleRepository scheduleRepository;
    private final ProblemRepository problemRepository;

    private Study checkStudyById(String id) {
        return studyRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );
    }

    private User checkUserById(String id) {
        return userRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
    }

    private User checkUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
    }

    public StudyRes getStudy(String username, String id){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        boolean isMember = false;
        for (User studyMember : study.getMembers()) {
            if (studyMember.getId().equals(user.getId())) {
                isMember=true;
                break;
            }
        }
        if (!isMember) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        List<Schedule> schedules = scheduleRepository.findAllByStudyAndStartedAtMonthOrderByStartedAtAsc(
                study, LocalDateTime.now().getMonth());

        return StudyRes.of(study, ScheduleListRes.of(schedules));
    }

    public Page<StudyListRes> getMoreStudy(String username, Pageable pageable) {
        User user = checkUserByUsername(username);
        Page<Study> studies = studyRepository.findAllByMembersContainsOrderByPinnedDesc(user, pageable);

        for (Study study : studies) {
            System.out.println(study.getId());
        }

        return studies.map(study -> StudyListRes.builder()
                .id(study.getId())
                .title(study.getTitle())
                .pinned(study.getPinned())
                .profileImgList(study.getMembers().stream().map(
                                member -> convertUtil.convertByteArrayToString(member.getProfileImg()))
                        .collect(Collectors.toList()))
                .build());
    }

    public String createStudy(String username, StudyReq studyReq) {
        User user = checkUserByUsername(username);

        List<User> members = new ArrayList<>();
        for (String member : studyReq.getMembers()) {
            members.add(checkUserById(member));
        }

        Study study = StudyReq.of(studyReq, user, members);
        studyRepository.save(study);

//        for (User member : members) {
//            List<Study> studies = member.getStudies();
//            studies.add(study);
//            member.setStudies(studies);
//        }
//        userRepository.saveAll(members);
        return study.getId();
    }

    public void updateRoomMaker(String username, String id, StudyMemberReq studyMemberReq) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        User member = checkUserById(studyMemberReq.getMemberId());

        if (!study.getRoomMaker().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        for (User studyMember : study.getMembers()) {
            if (studyMember.getId().equals(member.getId())) {
                study.setRoomMaker(studyMember);
                studyRepository.save(study);
                break;
            }
        }

        throw new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND);
    }

    public void deleteMember(String username, String id, StudyMemberReq studyMemberReq) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        User member = checkUserById(studyMemberReq.getMemberId());

        if (!study.getRoomMaker().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        if (user.getId().equals(member.getId())) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.USER_ID_DUPLICATE);
        }

        List<User> members = study.getMembers();
        members.removeIf(m -> m.getId().equals(member.getId()));
        study.setMembers(members);

//        List<Study> studies = member.getStudies();
//        studies.removeIf(s -> s.getId().equals(study.getId()));
//        member.setStudies(studies);

        studyRepository.save(study);
//        userRepository.save(member);
    }

    public void deleteMeFromStudy(String username, String id) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);

        if (study.getRoomMaker().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        List<User> users = study.getMembers();
        users.removeIf(u -> u.getId().equals(user.getId()));
        study.setMembers(users);

//        List<Study> studies = user.getStudies();
//        studies.removeIf(s -> s.getId().equals(study.getId()));
//        user.setStudies(studies);

        studyRepository.save(study);
//        userRepository.save(user);
    }

    public void deleteStudy(String username, String id){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);

        if (!study.getRoomMaker().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

//        List<User> members = study.getMembers();
//        for (User member : members) {
//            List<Study> studies = member.getStudies();
//            studies.removeIf(s -> s.getId().equals(study.getId()));
//            member.setStudies(studies);
//        }

//        userRepository.saveAll(members);
        studyRepository.delete(study);
    }

    public void updateStudy(String username, String id, StudyUpdateReq studyUpdateReq){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);

        if (!study.getRoomMaker().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        study.setTitle(studyUpdateReq.getTitle());
        study.setInfo(studyUpdateReq.getInfo());
        studyRepository.save(study);
    }

    public List<ProblemListRes> getStudyProblem(String id){
        List<Schedule> scheduleList = scheduleRepository.findAllByStudyId(id);
        List<Problem> problemList = new ArrayList<>();
        for(Schedule schedule:scheduleList){
            problemList.addAll(schedule.getToSolveProblems());
        }
        return ProblemListRes.of(problemList);
    }
}
