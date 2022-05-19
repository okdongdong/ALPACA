package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Chat;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    @Query("{'_id': {$lte : ?0}, 'studyId': ?1 }")
    Slice<Chat> findPartByStudyId(ObjectId id, Long studyId, Pageable pageable);

    Optional<Chat> findDistinctFirstByStudyIdOrderByIdDesc(Long studyId);
}
