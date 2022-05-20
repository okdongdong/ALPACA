package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.TodayProblem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TodayProblemRepository extends MongoRepository<TodayProblem, String> {

    Optional<TodayProblem> findByUserId(Long userId);

}
