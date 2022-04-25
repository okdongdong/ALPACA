package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.CodeSaveReq;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Code;
import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.repository.CodeRepository;
import com.ssafy.alpaca.db.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class CodeService {

    private final ScheduleRepository scheduleRepository;
    private final CodeRepository codeRepository;

    public void saveCode(CodeSaveReq codeSaveReq) throws IllegalAccessException {
        Schedule schedule = scheduleRepository.findById(codeSaveReq.getScheduleId()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND));
        if (!schedule.getStudy().getId().equals(codeSaveReq.getStudyId())){
            throw new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND);
        }

        if (codeSaveReq.getCode().isEmpty()){
            throw new IllegalAccessException(ExceptionUtil.NOT_VALID_VALUE);
        }
        codeRepository.save(
                Code.builder()
                        .userId(codeSaveReq.getUserId())
                        .studyId(codeSaveReq.getStudyId())
                        .scheduleId(codeSaveReq.getScheduleId())
                        .problemId(codeSaveReq.getProblemId())
                        .code(codeSaveReq.getCode())
                        .build()
        );
    }

}
