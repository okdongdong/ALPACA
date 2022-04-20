package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.ScheduleModifyReq;
import com.ssafy.alpaca.api.request.ScheduleReq;
import com.ssafy.alpaca.api.response.ScheduleInfoRes;
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
        for(String id:scheduleReq.getToSolveProblems())
        {
            problems.add(
                    problemRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND))
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

    public Map<String, String> modifySchedule(String id, ScheduleModifyReq scheduleModifyReq) throws IllegalAccessException {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND));
//      스터디장만 수정 가능
        List<Problem> problems = new ArrayList<>();
        for(String problemId:scheduleModifyReq.getToSolveProblems())
        {
            problems.add(
                    problemRepository.findById(problemId).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND))
            );
        };
        schedule.setStartedAt(scheduleModifyReq.getStartedAt());
        schedule.setToSolveProblems(problems);
        scheduleRepository.save(schedule);
        return getMessage("성공적으로 수정되었습니다.");
    }

    public ScheduleInfoRes getSchedule(String id) throws IllegalAccessException {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND));
        return ScheduleInfoRes.builder()
                .startedAt(schedule.getStartedAt())
                .toSolveProblems(schedule.getToSolveProblems())
                .build();
    }
}
