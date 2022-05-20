package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByNickname(String nickname);

    Boolean existsByBojId(String bojId);

    @Query(value = "select * from alpaca.user where " +
            "user.id != :userId and " +
            "user.nickname like concat(:nickname, '%') " +
            "order by user.username desc " +
            "limit 10", nativeQuery = true)
    List<User> findTop10ByNicknameStartingWithAndIdNotOrderByNicknameDesc(
            @Param("nickname")String nickname, @Param("userId")Long userId);

}
