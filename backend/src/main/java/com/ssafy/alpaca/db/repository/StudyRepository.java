package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Study;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudyRepository extends MongoRepository<Study, String> {

}
