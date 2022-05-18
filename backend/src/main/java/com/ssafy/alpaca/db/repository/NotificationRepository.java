package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends MongoRepository<Notification,String> {

    List<Notification> findAllByUserId(Long userId);

    Optional<Notification> findTopByUserIdAndStudyIdAndScheduleId(Long userId, Long studyId, Long scheduleId);

}
