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

    private User checkUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
    }

    private Schedule checkScheduleById(Long id) {
        return scheduleRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND)
        );
    }

    private Study checkStudyById(Long id) {
        return studyRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );
    }

    private void checkIsStudyMember(User user, Study study) throws IllegalAccessException {
        if (Boolean.TRUE.equals(!myStudyRepository.existsByUserAndStudy(user, study))) {
            throw new IllegalAccessException(ExceptionUtil.UNAUTHORIZED_USER);
        }
    }

    private List<ProblemListRes> getProblemListByToSolveProblems(List<ToSolveProblem> toSolveProblems) {
        List<ProblemListRes> problemListResList = new ArrayList<>();
        for (ToSolveProblem toSolveProblem : toSolveProblems) {
            Problem problem = problemRepository.findByProblemNumber(toSolveProblem.getProblemNumber()).orElseThrow(
                    () -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND)
            );

            problemListResList.add(
                    ProblemListRes.builder()
                            .problemNumber(problem.getProblemNumber())
                            .title(problem.getTitle())
                            .level(problem.getLevel())
                            .build()
            );
        }
        return problemListResList;
    }

    public Long createSchedule(String username, ScheduleReq scheduleReq) throws IllegalAccessException {
        LocalDateTime finishedAt = LocalDateTime.of(
                scheduleReq.getFinishedAt().getYear(),
                scheduleReq.getFinishedAt().getMonth(),
                scheduleReq.getFinishedAt().getDayOfMonth(),
                scheduleReq.getFinishedAt().getHour(),
                scheduleReq.getFinishedAt().getMinute()
        );
        LocalDateTime startedAt = LocalDateTime.of(
                scheduleReq.getStartedAt().getYear(),
                scheduleReq.getStartedAt().getMonth(),
                scheduleReq.getStartedAt().getDayOfMonth(),
                scheduleReq.getStartedAt().getHour(),
                scheduleReq.getStartedAt().getMinute()
        );
        if (finishedAt.isBefore(startedAt)) {
            throw new IllegalArgumentException(ExceptionUtil.INVALID_DATE_VALUE);
        }

        Study study = checkStudyById(scheduleReq.getStudyId());
        User user = checkUserByUsername(username);
        checkIsStudyMember(user, study);

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
                        .startedAt(startedAt)
                        .finishedAt(finishedAt)
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

    public ScheduleRes getTodaySchedule(String username, Long studyId) throws IllegalAccessException {
        Study study = checkStudyById(studyId);
        User user = checkUserByUsername(username);
        checkIsStudyMember(user, study);

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
        List<ProblemListRes> problemListRes = getProblemListByToSolveProblems(toSolveProblem);

        return ScheduleRes.builder()
                .startedAt(todaySchedule.get().getStartedAt())
                .finishedAt(todaySchedule.get().getFinishedAt())
                .problemListRes(problemListRes)
                .build();
    }

    public void updateSchedule(String username, Long id, ScheduleUpdateReq scheduleUpdateReq) throws IllegalAccessException {
        LocalDateTime finishedAt = LocalDateTime.of(
                scheduleUpdateReq.getFinishedAt().getYear(),
                scheduleUpdateReq.getFinishedAt().getMonth(),
                scheduleUpdateReq.getFinishedAt().getDayOfMonth(),
                scheduleUpdateReq.getFinishedAt().getHour(),
                scheduleUpdateReq.getFinishedAt().getMinute()
        );
        LocalDateTime startedAt = LocalDateTime.of(
                scheduleUpdateReq.getStartedAt().getYear(),
                scheduleUpdateReq.getStartedAt().getMonth(),
                scheduleUpdateReq.getStartedAt().getDayOfMonth(),
                scheduleUpdateReq.getStartedAt().getHour(),
                scheduleUpdateReq.getStartedAt().getMinute()
        );
        if (finishedAt.isBefore(startedAt)) {
            throw new IllegalArgumentException(ExceptionUtil.INVALID_DATE_VALUE);
        }

        Schedule schedule = checkScheduleById(id);
        Study study = schedule.getStudy();

        LocalDateTime localDateTime = LocalDateTime.of(
                scheduleUpdateReq.getStartedAt().getYear(),
                scheduleUpdateReq.getStartedAt().getMonth(),
                scheduleUpdateReq.getStartedAt().getDayOfMonth(), 0, 0);
        Optional<Schedule> checkSchedule = scheduleRepository.findByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(
                study, localDateTime, localDateTime.plusDays(1));

        if (checkSchedule.isEmpty() || !schedule.getId().equals(checkSchedule.get().getId())) {
            throw new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND);
        }

//      스터디원만 수정 가능
        User user = checkUserByUsername(username);
        checkIsStudyMember(user, study);

        schedule.setStartedAt(startedAt);
        schedule.setFinishedAt(finishedAt);
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
        List<ProblemListRes> problemListRes = getProblemListByToSolveProblems(toSolveProblem);

        return ScheduleRes.builder()
                .startedAt(schedule.getStartedAt())
                .finishedAt(schedule.getFinishedAt())
                .problemListRes(problemListRes)
                .build();
    }

    public List<ScheduleListRes> getScheduleMonthList(String username, Long id, Integer year, Integer month) throws IllegalAccessException {
        Study study = checkStudyById(id);
        User user = checkUserByUsername(username);
        checkIsStudyMember(user, study);

        LocalDateTime localDateTime = LocalDateTime.of(year, month, 1, 0, 0);
        return ScheduleListRes.of(scheduleRepository.findAllByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtAsc(
                study, localDateTime.minusWeeks(1), localDateTime.plusMonths(1).plusWeeks(2)));
    }

    public void deleteSchedule(String username, Long id) throws IllegalAccessException {
        User user = checkUserByUsername(username);
        Schedule schedule = checkScheduleById(id);
        Study study = schedule.getStudy();

        if (Boolean.TRUE.equals(!myStudyRepository.existsByUserAndStudyAndIsRoomMaker(user, study, true))) {
            throw new IllegalAccessException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        scheduleRepository.delete(schedule);
    }
}
