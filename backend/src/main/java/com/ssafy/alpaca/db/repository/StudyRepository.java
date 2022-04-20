package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Study;
import com.ssafy.alpaca.db.document.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudyRepository extends MongoRepository<Study, String> {
    Boolean existsByRoomMaker(User user);
}
