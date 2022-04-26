package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.ToSolveProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToSolveProblemRepository extends JpaRepository<ToSolveProblem,String> {

    List<ToSolveProblem> findAllBySchedule(Schedule schedule);
}
