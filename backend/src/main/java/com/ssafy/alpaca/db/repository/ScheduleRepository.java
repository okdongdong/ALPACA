package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.Study;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

//    List<Schedule> findAllByStudyAndStartedAtMonthOrderByStartedAtAsc(Study study, Month month);

//    List<Schedule> findAllByStudyAndStartedAtYearAndStartedAtMonthOrderByStartedAtAsc(Study study, Integer year, Month month);

    List<Schedule> findAllByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtAsc(Study study, LocalDateTime a, LocalDateTime b);

    @EntityGraph(attributePaths = "toSolveProblems")
    List<Schedule> findAllByStudyId(Long studyId);

//    Boolean existsByStudyAndStartedAtYearAndStartedAtMonthAndStartedAtDayOfMonth(Study study, Integer year, Month month, Integer day);

    Schedule findByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(Study study, LocalDateTime a, LocalDateTime b);

    Boolean existsByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(Study study, LocalDateTime a, LocalDateTime b);

}
