package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Chat;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    Slice<Chat> findAllByStudyId(Long studyId, Pageable pageable);
}
