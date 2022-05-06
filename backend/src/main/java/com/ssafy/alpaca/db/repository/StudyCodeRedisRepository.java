package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.redis.StudyCode;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface StudyCodeRedisRepository extends CrudRepository<StudyCode, String> {
}
