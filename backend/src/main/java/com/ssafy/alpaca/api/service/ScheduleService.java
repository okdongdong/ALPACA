package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.ScheduleUpdateReq;
import com.ssafy.alpaca.api.request.ScheduleReq;
import com.ssafy.alpaca.api.response.ProblemListRes;
import com.ssafy.alpaca.api.response.ScheduleRes;
import com.ssafy.alpaca.api.response.ScheduleListRes;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.entity.*;
import com.ssafy.alpaca.db.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleService {

    private final UserRepository userRepository;
    private final MyStudyRepository myStudyRepository;
    private final StudyRepository studyRepository;
    private final ScheduleRepository scheduleRepository;
    private final ToSolveProblemRepository toSolveProblemRepository;
    private final ProblemRepository problemRepository;

    private Schedule checkScheduleById(Long id) {
        return scheduleRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND)
        );
    }

    public Long createSchedule(ScheduleReq scheduleReq) {
        if (scheduleReq.getFinishedAt().isBefore(scheduleReq.getStartedAt()) ||
                scheduleReq.getFinishedAt().isEqual(scheduleReq.getStartedAt())) {
            throw new IllegalArgumentException(ExceptionUtil.INVALID_DATE_VALUE);
        }

        Study study = studyRepository.findById(scheduleReq.getStudyId()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        LocalDateTime localDateTime = LocalDateTime.of(
                scheduleReq.getStartedAt().getYear(),
                scheduleReq.getStartedAt().getMonth(),
                scheduleReq.getStartedAt().getDayOfMonth(), 0, 0);
        if (Boolean.TRUE.equals(scheduleRepository.existsByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(
                study, localDateTime, localDateTime.plusDays(1)))
        ) {
            throw new NullPointerException(ExceptionUtil.STUDY_DATE_DUPLICATE);
        }

        Schedule schedule = Schedule.builder()
                        .study(study)
                        .startedAt(scheduleReq.getStartedAt())
                        .finishedAt(scheduleReq.getFinishedAt())
                        .build();
        List<ToSolveProblem> toSolveProblems = new ArrayList<>();
        for (Long number : scheduleReq.getToSolveProblems()) {
            toSolveProblems.add(
                    ToSolveProblem.builder()
                            .schedule(schedule)
                            .problemNumber(number)
                            .build()
            );
        }

        scheduleRepository.save(schedule);
        toSolveProblemRepository.saveAll(toSolveProblems);
        return schedule.getId();
    }

    public ScheduleRes getTodaySchedule(String username, Long studyId) {
        Study study = studyRepository.findById(studyId).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        LocalDateTime localDateTime = LocalDateTime.now();
        LocalDateTime today = LocalDateTime.of(
                localDateTime.getYear(),
                localDateTime.getMonth(),
                localDateTime.getDayOfMonth(), 0, 0);
        Optional<Schedule> todaySchedule = scheduleRepository.findByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(
                study, today, today.plusDays(1));

        if (todaySchedule.isEmpty()) {
            throw new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND);
        }

        List<ToSolveProblem> toSolveProblem = toSolveProblemRepository.findAllBySchedule(todaySchedule.get());
        List<ProblemListRes> problemListRes = new ArrayList<>();
        for (ToSolveProblem solveProblem : toSolveProblem) {
            Problem problem = problemRepository.findByProblemNumber(solveProblem.getProblemNumber()).orElseThrow(
                    () -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND));
            problemListRes.add(ProblemListRes.builder()
                    .problemNumber(problem.getProblemNumber())
                    .title(problem.getTitle())
                    .level(problem.getLevel())
                    .build());
        }
        return ScheduleRes.builder()
                .startedAt(todaySchedule.get().getStartedAt())
                .finishedAt(todaySchedule.get().getFinishedAt())
                .problemListRes(problemListRes)
                .build();
    }

    public void updateSchedule(Long id, ScheduleUpdateReq scheduleUpdateReq) {
        if (scheduleUpdateReq.getFinishedAt().isBefore(scheduleUpdateReq.getStartedAt()) ||
                scheduleUpdateReq.getFinishedAt().isEqual(scheduleUpdateReq.getStartedAt())) {
            throw new IllegalArgumentException(ExceptionUtil.INVALID_DATE_VALUE);
        }

        Schedule schedule = checkScheduleById(id);
        Study study = studyRepository.findById(schedule.getStudy().getId()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        LocalDateTime localDateTime = LocalDateTime.of(
                scheduleUpdateReq.getStartedAt().getYear(),
                scheduleUpdateReq.getStartedAt().getMonth(),
                scheduleUpdateReq.getStartedAt().getDayOfMonth(), 0, 0);
        Optional<Schedule> checkSchedule = scheduleRepository.findByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(
                study, localDateTime, localDateTime.plusDays(1));

        if (checkSchedule.isEmpty() || !schedule.getId().equals(checkSchedule.get().getId())) {
            throw new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND);
        }

//      스터디장만 수정 가능
        schedule.setStartedAt(scheduleUpdateReq.getStartedAt());
        schedule.setFinishedAt(scheduleUpdateReq.getFinishedAt());
        scheduleRepository.save(schedule);
        for (Long number : scheduleUpdateReq.getToSolveProblems()) {
            toSolveProblemRepository.save(
                    ToSolveProblem.builder()
                            .schedule(schedule)
                            .problemNumber(number)
                            .build());
        }
    }

    public ScheduleRes getSchedule(Long id) {
        Schedule schedule = checkScheduleById(id);
        List<ToSolveProblem> toSolveProblem = toSolveProblemRepository.findAllBySchedule(schedule);
        List<ProblemListRes> problemListRes = new ArrayList<>();
        for (ToSolveProblem solveProblem : toSolveProblem) {
            Problem problem = problemRepository.findByProblemNumber(solveProblem.getProblemNumber()).orElseThrow(
                    () -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND));
            problemListRes.add(ProblemListRes.builder()
                            .problemNumber(problem.getProblemNumber())
                            .title(problem.getTitle())
                            .level(problem.getLevel())
                            .build());
        }
        return ScheduleRes.builder()
                .startedAt(schedule.getStartedAt())
                .finishedAt(schedule.getFinishedAt())
                .problemListRes(problemListRes)
                .build();
    }

    public List<ScheduleListRes> getScheduleMonthList(String username, Long id, Integer year, Integer month) throws IllegalAccessException {
        Study study = studyRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        MyStudy myStudy = myStudyRepository.findByUserAndStudy(user, study).orElseThrow(
                () -> new IllegalAccessException(ExceptionUtil.UNAUTHORIZED_USER));

        LocalDateTime localDateTime = LocalDateTime.of(year, month, 1, 0, 0);
        return ScheduleListRes.of(scheduleRepository.findAllByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtAsc(
                study, localDateTime.minusWeeks(1), localDateTime.plusMonths(1).plusWeeks(2)));
    }

    public void deleteSchedule(String username, Long id) throws IllegalAccessException {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
        Schedule schedule = checkScheduleById(id);
        MyStudy myStudy = myStudyRepository.findByUserAndStudy(user, schedule.getStudy()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        if (Boolean.TRUE.equals(!myStudy.getIsRoomMaker())) {
            throw new IllegalAccessException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        scheduleRepository.delete(schedule);
    }
}
