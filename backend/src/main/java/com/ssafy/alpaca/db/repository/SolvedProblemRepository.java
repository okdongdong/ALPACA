package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.SolvedProblem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolvedProblemRepository extends JpaRepository<SolvedProblem, Long> {

    @EntityGraph(attributePaths = "user")
    List<SolvedProblem> findAllByProblemId(String problemId);
}
