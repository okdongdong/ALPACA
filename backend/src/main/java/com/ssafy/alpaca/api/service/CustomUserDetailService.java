package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.common.etc.CacheKey;
import com.ssafy.alpaca.common.etc.CustomUserDetails;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
// 필터에서 처리할 서비스
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;


    // 1. 캐시에서 메서드의 파라미터로 캐시를 먼저 조회
    // 2. Redis에 데이터가 없으면 DB에서 직접 조회
    // value::key의 형태로 Redis의 키에 저장됨, 값은 CustomerUserDetails 형태로 저장됨
    @Override
    @Cacheable(value = CacheKey.USER, key = "#username", unless = "#result == null")
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("ExceptionUtil.USER_NOT_FOUND"));
        return CustomUserDetails.of(user);
    }
}
