package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Schedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends MongoRepository<Schedule, String>  {
    List<Schedule> findAllByStudyId(String id);
}
