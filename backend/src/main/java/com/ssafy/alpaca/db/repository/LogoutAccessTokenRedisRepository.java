package com.ssafy.alpaca.db.repository;

import com.ssafy.alpaca.common.jwt.LogoutAccessToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogoutAccessTokenRedisRepository extends CrudRepository<LogoutAccessToken, String> {
}
