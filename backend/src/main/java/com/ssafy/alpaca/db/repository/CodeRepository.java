package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Code;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeRepository extends MongoRepository<Code, String> {

    List<Code> findAllByStudyId(Long studyId);
}
