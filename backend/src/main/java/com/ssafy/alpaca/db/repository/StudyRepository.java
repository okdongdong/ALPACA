package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.Study;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface StudyRepository extends JpaRepository<Study, Long> {
}
