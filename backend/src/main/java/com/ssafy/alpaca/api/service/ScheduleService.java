package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.ScheduleReq;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.document.Schedule;
import com.ssafy.alpaca.db.repository.ProblemRepository;
import com.ssafy.alpaca.db.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ProblemRepository problemRepository;

    private Map<String, String> getMessage(String returnMessage){
        Map<String, String> map = new HashMap<>();
        map.put("message", returnMessage);
        return map;
    }

    public Map<String, String> createSchedule(ScheduleReq scheduleReq) throws IllegalAccessException {
//        if (scheduleReq.getStudyId().isEmpty()) {
//            throw new IllegalAccessException(ExceptionUtil.NOT_VALID_VALUE);
//        }
        List<Problem> problems = new ArrayList<>();
        for(String problemNum:scheduleReq.getToSolveProblems())
        {
            problems.add(problemRepository.findByNumber(
                    problemNum
                )
            );
        };
        Schedule schedule = scheduleRepository.save(
                Schedule.builder()
                        .studyId(scheduleReq.getStudyId())
                        .startedAt(scheduleReq.getStartedAt())
                        .toSolveProblems(problems)
                        .build());
        return getMessage(schedule.getId());
    }
}
