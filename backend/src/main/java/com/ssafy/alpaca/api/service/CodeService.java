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

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class CodeService {

    private final ScheduleRepository scheduleRepository;
    private final CodeRepository codeRepository;

    public void createCode(CodeSaveReq codeSaveReq) throws IllegalAccessException {
        if (codeSaveReq.getCode().isEmpty()){
            throw new IllegalAccessException(ExceptionUtil.NOT_VALID_VALUE);
        }

        List<Code> codes = codeRepository.findAllByUserIdAndProblemIdOrderBySubmittedAtAsc(
                codeSaveReq.getUserId(), codeSaveReq.getProblemId());
        if (10 <= codes.size()) {
            Code code = codes.get(0);
            codeRepository.delete(code);
        }

        codeRepository.save(
                Code.builder()
                        .userId(codeSaveReq.getUserId())
                        .problemId(codeSaveReq.getProblemId())
                        .code(codeSaveReq.getCode())
                        .build()
        );
    }

}
