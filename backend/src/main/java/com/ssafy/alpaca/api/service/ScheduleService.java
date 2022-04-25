package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.ScheduleListReq;
import com.ssafy.alpaca.api.request.ScheduleUpdateReq;
import com.ssafy.alpaca.api.request.ScheduleReq;
import com.ssafy.alpaca.api.response.ScheduleRes;
import com.ssafy.alpaca.api.response.ScheduleListRes;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Code;
import com.ssafy.alpaca.db.entity.MyStudy;
import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.ToSolveProblem;
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

    private final StudyRepository studyRepository;
    private final ScheduleRepository scheduleRepository;
    private final ToSolveProblemRepository toSolveProblemRepository;
    private final CodeRepository codeRepository;
    private final MyStudyRepository myStudyRepository;


    public String createSchedule(ScheduleReq scheduleReq) throws IllegalAccessException {
        if (scheduleReq.getFinishedAt().isBefore(scheduleReq.getStartedAt()) ||
                scheduleReq.getFinishedAt().isEqual(scheduleReq.getStartedAt())) {
            throw new IllegalAccessException(ExceptionUtil.INVALID_DATE_VALUE);
        }

        Study study = studyRepository.findById(scheduleReq.getStudyId()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        if (scheduleRepository.existsByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(
                study,
                LocalDateTime.of(scheduleReq.getStartedAt().getYear(), scheduleReq.getStartedAt().getMonth(), scheduleReq.getStartedAt().getDayOfMonth(), 0, 0),
                LocalDateTime.of(scheduleReq.getStartedAt().getYear(), scheduleReq.getStartedAt().getMonth(), scheduleReq.getStartedAt().getDayOfMonth() + 1, 0, 0))
        ) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.STUDY_DATE_DUPLICATE);
        }

        Schedule schedule = scheduleRepository.save(
                Schedule.builder()
                        .study(study)
                        .startedAt(scheduleReq.getStartedAt())
                        .finishedAt(scheduleReq.getFinishedAt())
                        .build());
        for (String id : scheduleReq.getToSolveProblems()) {
            toSolveProblemRepository.save(
                    ToSolveProblem.builder()
                            .schedule(schedule)
                            .problemId(id)
                            .build());
        }

        return String.valueOf(schedule.getId());
    }

    public void updateSchedule(Long id, ScheduleUpdateReq scheduleUpdateReq) throws IllegalAccessException {
        if (scheduleUpdateReq.getFinishedAt().isBefore(scheduleUpdateReq.getStartedAt()) ||
                scheduleUpdateReq.getFinishedAt().isEqual(scheduleUpdateReq.getStartedAt())) {
            throw new IllegalAccessException(ExceptionUtil.INVALID_DATE_VALUE);
        }

        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND));
        Study study = studyRepository.findById(schedule.getStudy().getId()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        List<MyStudy> MyStudyList = myStudyRepository.findAllByStudy(study);

        if (scheduleRepository.existsByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(
                study,
                LocalDateTime.of(scheduleUpdateReq.getStartedAt().getYear(), scheduleUpdateReq.getStartedAt().getMonth(), scheduleUpdateReq.getStartedAt().getDayOfMonth(), 0, 0),
                LocalDateTime.of(scheduleUpdateReq.getStartedAt().getYear(), scheduleUpdateReq.getStartedAt().getMonth(), scheduleUpdateReq.getStartedAt().getDayOfMonth() + 1, 0, 0))
        ) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.STUDY_DATE_DUPLICATE);
        }

//      스터디장만 수정 가능
        schedule.setStartedAt(scheduleUpdateReq.getStartedAt());
        schedule.setFinishedAt(scheduleUpdateReq.getFinishedAt());
        scheduleRepository.save(schedule);
        codeRepository.deleteAll(codeRepository.findAllByScheduleId(schedule.getId()));
        for (String problemId : scheduleUpdateReq.getToSolveProblems()) {
            toSolveProblemRepository.save(
                    ToSolveProblem.builder()
                            .schedule(schedule)
                            .problemId(problemId)
                            .build());
        }
    }

    public ScheduleRes getSchedule(String id) {
        Schedule schedule = scheduleRepository.findById(Long.valueOf(id)).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND));
        return ScheduleRes.builder()
                .startedAt(schedule.getStartedAt())
                .finishedAt(schedule.getFinishedAt())
                .build();
    }

    public List<ScheduleListRes> getScheduleMonthList(ScheduleListReq scheduleListReq) {
        Study study = studyRepository.findById(scheduleListReq.getStudyId()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        return ScheduleListRes.of(scheduleRepository.findAllByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtAsc(
                study,
                LocalDateTime.of(scheduleListReq.getYear(), scheduleListReq.getMonth(), 1, 0, 0),
                LocalDateTime.of(scheduleListReq.getYear(), scheduleListReq.getMonth() + 1, 1, 0, 0))
        );
    }

    public void deleteSchedule(Long id) {
        List<Code> codes = codeRepository.findAllByScheduleId(id);
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND));
        codeRepository.deleteAll(codes);
        scheduleRepository.delete(schedule);
    }
}
