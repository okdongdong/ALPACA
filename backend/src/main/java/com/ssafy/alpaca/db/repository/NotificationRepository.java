package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification,String> {

    List<Notification> findAllByUserId(Long userId);

}
