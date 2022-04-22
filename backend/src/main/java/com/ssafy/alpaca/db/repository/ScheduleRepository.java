package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.Study;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findAllByStudyAndStartedAtMonthOrderByStartedAtAsc(Study study, Month month);

    List<Schedule> findAllByStudyAndStartedAt_YearAndStartedAt_MonthOrderByStartedAtAsc(Study study, Integer year, Month month);

    @EntityGraph(attributePaths = "toSolveProblems")
    List<Schedule> findAllByStudyId(Long studyId);

    Boolean existsByStudyAndStartedAtDate(Study study, LocalDate localDate);

}
