package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.StudyMemberReq;
import com.ssafy.alpaca.api.request.StudyReq;
import com.ssafy.alpaca.api.response.StudyRes;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Schedule;
import com.ssafy.alpaca.db.document.Study;
import com.ssafy.alpaca.db.document.User;
import com.ssafy.alpaca.db.repository.StudyRepository;
import com.ssafy.alpaca.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class StudyService {

    private final UserRepository userRepository;
    private final StudyRepository studyRepository;

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

        if (!study.getMembers().contains(user)) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        return StudyRes.builder()
                .title(study.getTitle())
                .info(study.getInfo())
                .members(study.getMembers())
                .schedules(study.getSchedules())
                .build();
    }

    public void createStudy(String username, StudyReq studyReq) {
        User user = checkUserByUsername(username);

        List<User> members = new ArrayList<>();
        for (String member : studyReq.getMembers()) {
            members.add(checkUserById(member));
        }

        Study study = Study.builder()
                .title(studyReq.getTitle())
                .info(studyReq.getInfo())
                .roomMaker(user)
                .members(members)
                .build();
        studyRepository.save(study);

        List<Study> studies = user.getStudies();
        studies.add(study);

        user.setStudies(studies);
        userRepository.save(user);
    }

    public void updateRoomMaker(String username, String id, StudyMemberReq studyMemberReq) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        User member = checkUserById(studyMemberReq.getMemberId());

        if (!study.getRoomMaker().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        if (!study.getMembers().contains(member)) {
            throw new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND);
        }

        study.setRoomMaker(member);
        studyRepository.save(study);
    }

    public void deleteMember(String username, String id, StudyMemberReq studyMemberReq) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        User member = checkUserById(studyMemberReq.getMemberId());

        if (!study.getRoomMaker().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        study.getMembers().remove(member);
        member.getStudies().remove(study);
        studyRepository.save(study);
        userRepository.save(member);
    }

    public void deleteMeFromStudy(String username, String id) {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);

        if (study.getRoomMaker().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        study.getMembers().remove(user);
        user.getStudies().remove(study);
        studyRepository.save(study);
        userRepository.save(user);
    }

    public void deleteStudy(String username, String id){
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);

        if (!study.getRoomMaker().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        studyRepository.delete(study);
    }
}
