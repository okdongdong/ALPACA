package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.MyStudy;
import com.ssafy.alpaca.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MyStudyRepository extends JpaRepository<MyStudy, Long> {

    List<MyStudy> findTop3ByUserOrderByPinnedTimeDesc(User user);

}
