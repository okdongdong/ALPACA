package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.response.StudyRes;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Study;
import com.ssafy.alpaca.db.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class StudyService {

    private final StudyRepository studyRepository;

    public StudyRes getStudy(String id){
        Study study = studyRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND));
        return StudyRes.builder()
                .title(study.getTitle())
                .info(study.getInfo())
                .build();
    }

    public void deleteStudy(String id){
        Optional<Study> study = studyRepository.findById(id);
        if (study.isEmpty()) {
            throw new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND);
        }
        Study deleteStudy = study.get();
        studyRepository.delete(deleteStudy);
    }
}
