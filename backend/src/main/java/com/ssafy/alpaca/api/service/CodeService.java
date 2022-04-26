package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.CodeReq;
import com.ssafy.alpaca.api.request.CodeUpdateReq;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Code;
import com.ssafy.alpaca.db.repository.CodeRepository;
import com.ssafy.alpaca.db.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CodeService {

    private final ScheduleRepository scheduleRepository;
    private final CodeRepository codeRepository;

    public void createCode(CodeUpdateReq codeUpdateReq) throws IllegalAccessException {
        if (codeUpdateReq.getCode().isEmpty()){
            throw new IllegalAccessException(ExceptionUtil.NOT_VALID_VALUE);
        }

        List<Code> codes = codeRepository.findAllByUserIdAndProblemIdOrderBySubmittedAtAsc(
                codeUpdateReq.getUserId(), codeUpdateReq.getProblemId());
        if (10 <= codes.size()) {
            Code code = codes.get(0);
            codeRepository.delete(code);
        }

        codeRepository.save(
                Code.builder()
                        .userId(codeUpdateReq.getUserId())
                        .problemId(codeUpdateReq.getProblemId())
                        .code(codeUpdateReq.getCode())
                        .build()
        );
    }

    public List<Code> getCode(CodeReq codeReq) {
        return codeRepository.findAllByUserIdAndProblemIdOrderBySubmittedAtAsc(
                codeReq.getUserId(), codeReq.getProblemId());
    }

}
