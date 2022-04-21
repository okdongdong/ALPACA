package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.ScheduleUpdateReq;
import com.ssafy.alpaca.api.request.ScheduleReq;
import com.ssafy.alpaca.api.response.ScheduleInfoRes;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.document.Schedule;
import com.ssafy.alpaca.db.document.Study;
import com.ssafy.alpaca.db.repository.ProblemRepository;
import com.ssafy.alpaca.db.repository.ScheduleRepository;
import com.ssafy.alpaca.db.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleService {

    private final StudyRepository studyRepository;
    private final ScheduleRepository scheduleRepository;
    private final ProblemRepository problemRepository;

    private Map<String, String> getMessage(String returnMessage){
        Map<String, String> map = new HashMap<>();
        map.put("message", returnMessage);
        return map;
    }

    public String createSchedule(ScheduleReq scheduleReq) throws IllegalAccessException {
        if (scheduleReq.getFinishedAt().isAfter(scheduleReq.getStartedAt()) ||
        scheduleReq.getFinishedAt().isEqual(scheduleReq.getStartedAt())) {
            throw new IllegalAccessException(ExceptionUtil.INVALID_DATE_VALUE);
        }

        Study study = studyRepository.findById(scheduleReq.getStudyId()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        if (scheduleRepository.existsByStudyAndStartedAtDate(
                study, LocalDate.of(
                        scheduleReq.getStartedAt().getYear(),
                        scheduleReq.getStartedAt().getMonth(),
                        scheduleReq.getStartedAt().getDayOfMonth())
        )) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.STUDY_DATE_DUPLICATE);
        }

        List<Problem> problems = new ArrayList<>();
        for(String id:scheduleReq.getToSolveProblems())
        {
            problems.add(
                    problemRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND))
            );
        };
        Schedule schedule = scheduleRepository.save(
                Schedule.builder()
                        .study(study)
                        .startedAt(scheduleReq.getStartedAt())
                        .finishedAt(scheduleReq.getFinishedAt())
                        .toSolveProblems(problems)
                        .build());
        return schedule.getId();
    }

    public void updateSchedule(String id, ScheduleUpdateReq scheduleUpdateReq) throws IllegalAccessException {
        if (scheduleUpdateReq.getFinishedAt().isAfter(scheduleUpdateReq.getStartedAt()) ||
                scheduleUpdateReq.getFinishedAt().isEqual(scheduleUpdateReq.getStartedAt())) {
            throw new IllegalAccessException(ExceptionUtil.INVALID_DATE_VALUE);
        }

        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND));
        Study study = studyRepository.findById(schedule.getStudy().getId()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        if (scheduleRepository.existsByStudyAndStartedAtDate(
                study, LocalDate.of(
                        scheduleUpdateReq.getStartedAt().getYear(),
                        scheduleUpdateReq.getStartedAt().getMonth(),
                        scheduleUpdateReq.getStartedAt().getDayOfMonth())
        )) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.STUDY_DATE_DUPLICATE);
        }

//      스터디장만 수정 가능
        List<Problem> problems = new ArrayList<>();
        for(String problemId: scheduleUpdateReq.getToSolveProblems())
        {
            problems.add(
                    problemRepository.findById(problemId).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND))
            );
        };
        schedule.setStartedAt(scheduleUpdateReq.getStartedAt());
        schedule.setFinishedAt(scheduleUpdateReq.getFinishedAt());
        schedule.setToSolveProblems(problems);
        scheduleRepository.save(schedule);
    }

    public ScheduleInfoRes getSchedule(String id) throws IllegalAccessException {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND));
        return ScheduleInfoRes.builder()
                .startedAt(schedule.getStartedAt())
                .toSolveProblems(schedule.getToSolveProblems())
                .build();
    }

    public void deleteSchedule(String id) {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND));
        scheduleRepository.delete(schedule);
    }
}
