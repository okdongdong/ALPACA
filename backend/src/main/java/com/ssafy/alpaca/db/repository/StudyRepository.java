package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.Study;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyRepository extends JpaRepository<Study, Long> {
    Boolean existsByRoomMaker(User user);

    List<Study> findTop3ByMembersContainsOrderByPinnedDesc(User user);

    Page<Study> findAllByMembersContainsOrderByPinnedDesc(User user, Pageable pageable);

}
