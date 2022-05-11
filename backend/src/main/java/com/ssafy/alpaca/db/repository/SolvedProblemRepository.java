package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.SolvedProblem;
import com.ssafy.alpaca.db.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;

@Repository
public interface SolvedProblemRepository extends JpaRepository<SolvedProblem, Long> {

    Boolean existsByUserAndProblemNumber(User user, Long problemNumber);

    @EntityGraph(attributePaths = "user")
    List<SolvedProblem> findAllByProblemNumber(Long problemNumber);

    List<SolvedProblem> findAllByUser(User user);

    @Query(nativeQuery = true, value = "SELECT problem_number FROM solved_problem WHERE user_id = :userId")
    List<Long> findProblemNumbersByUser(@Param("userId") Long userId);

    @Query(nativeQuery = true, value = "SELECT problem_number FROM solved_problem WHERE user_id = :userId")
    HashSet<Long> findProblemNumbersByUserId(@Param("userId")Long userId);
}
