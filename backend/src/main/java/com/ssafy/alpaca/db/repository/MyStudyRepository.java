package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.MyStudy;
import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MyStudyRepository extends JpaRepository<MyStudy, Long> {
    Optional<MyStudy> findByUserAndStudy(User user, Study study);

    @EntityGraph(attributePaths = {"user"})
    List<MyStudy> findAllByStudy(Study study);

    @EntityGraph(attributePaths = {"study"})
    Page<MyStudy> findAllByUser(User user, Pageable pageable);

}
