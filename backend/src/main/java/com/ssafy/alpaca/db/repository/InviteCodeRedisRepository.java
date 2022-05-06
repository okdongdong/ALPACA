package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.db.redis.InviteCode;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface InviteCodeRedisRepository extends CrudRepository<InviteCode, Long> {
}
