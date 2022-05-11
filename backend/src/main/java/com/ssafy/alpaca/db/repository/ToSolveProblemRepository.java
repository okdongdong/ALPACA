package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.ToSolveProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Repository
public interface ToSolveProblemRepository extends JpaRepository<ToSolveProblem,String> {

    Optional<ToSolveProblem> findByScheduleAndProblemNumber(Schedule schedule, Long problemNumber);

    List<ToSolveProblem> findAllBySchedule(Schedule schedule);

    @Query(nativeQuery = true, value = "SELECT problem_number FROM to_solve_problem WHERE schedule_id = :scheduleId")
    HashSet<Long> findProblemNumbersByScheduleId(@Param("scheduleId")Long scheduleId);

}
