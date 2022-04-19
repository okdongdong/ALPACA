package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.StudyReq;
import com.ssafy.alpaca.api.response.StudyRes;
import com.ssafy.alpaca.common.util.ExceptionUtil;
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
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class StudyService {

    private final UserRepository userRepository;
    private final StudyRepository studyRepository;

    public StudyRes getStudy(String id){
        Study study = studyRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND));
        return StudyRes.builder()
                .title(study.getTitle())
                .info(study.getInfo())
                .build();
    }

    public void createStudy(String username, StudyReq studyReq) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));

        List<User> members = new ArrayList<>();
        for (String member : studyReq.getMembers()) {
            members.add(userRepository.findById(member).orElseThrow(
                            () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)));
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

    public void deleteStudy(String username, String id){
        Study study = studyRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );

        if (!study.getRoomMaker().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        studyRepository.delete(study);
    }
}
