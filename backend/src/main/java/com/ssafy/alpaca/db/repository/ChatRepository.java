package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
}
