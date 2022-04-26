package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.Study;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findAllByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtAsc(Study study, LocalDateTime a, LocalDateTime b);

    @EntityGraph(attributePaths = "toSolveProblems")
    List<Schedule> findAllByStudyId(Long studyId);

    Optional<Schedule> findByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(Study study, LocalDateTime a, LocalDateTime b);

    Boolean existsByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(Study study, LocalDateTime a, LocalDateTime b);

}
