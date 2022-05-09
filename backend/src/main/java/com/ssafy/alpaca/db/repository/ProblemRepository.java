package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Problem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemRepository extends MongoRepository<Problem,String> {

    List<Problem> findTop10ByProblemNumberStartingWithOrderByProblemNumberAsc(Long problemNumber);

    Optional<Problem> findByProblemNumber(Long problemNumber);

    Boolean existsByProblemNumber(Long problemNumber);

    List<Problem> findAllByClassLevel(Long classLevel);

}
