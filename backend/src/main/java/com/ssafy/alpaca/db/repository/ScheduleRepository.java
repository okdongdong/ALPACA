package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.document.Schedule;
import com.ssafy.alpaca.db.document.Study;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Month;
import java.util.List;

@Repository
public interface ScheduleRepository extends MongoRepository<Schedule, String> {

    List<Schedule> findAllByStudyAndStartedAtMonthOrderByStartedAtAsc(Study study, Month month);

}