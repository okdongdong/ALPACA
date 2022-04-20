package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Schedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleRepository extends MongoRepository<Schedule, String>  {
}
