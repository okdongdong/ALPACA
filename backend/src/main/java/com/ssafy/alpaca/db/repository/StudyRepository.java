package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyRepository extends JpaRepository<Study, Long> {

    Boolean existsByRoomMaker(User user);

    List<Study> findTop3ByMembersContainsOrderByPinnedDesc(User user);

}
