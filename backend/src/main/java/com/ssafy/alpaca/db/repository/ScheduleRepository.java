package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.Study;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    @EntityGraph(attributePaths = "toSolveProblems")
    List<Schedule> findAllByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThanOrderByStartedAtAsc(Study study, OffsetDateTime a, OffsetDateTime b);

    @EntityGraph(attributePaths = "toSolveProblems")
    List<Schedule> findAllByStudyId(Long studyId);

    Optional<Schedule> findByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(Study study, OffsetDateTime a, OffsetDateTime b);

    Boolean existsByStudyAndStartedAtGreaterThanEqualAndStartedAtLessThan(Study study, OffsetDateTime a, OffsetDateTime b);

}
