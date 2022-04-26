package com.ssafy.alpaca.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import static com.ssafy.alpaca.common.jwt.JwtExpirationEnums.ACCESS_TOKEN_EXPIRATION_TIME;
import static com.ssafy.alpaca.common.jwt.JwtExpirationEnums.REFRESH_TOKEN_EXPIRATION_TIME;


@Slf4j
@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey(SECRET_KEY))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 토큰에서 회원 정보 추출
    public String getUsername(String token) {
        return extractAllClaims(token).get("username", String.class);
    }

    private Key getSigningKey(String secretKey) {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Boolean isTokenExpired(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    public String generateAccessToken(String username) {
        return doGenerateToken(username, ACCESS_TOKEN_EXPIRATION_TIME.getValue());
    }

    public String generateRefreshToken(String username) {
        return doGenerateToken(username, REFRESH_TOKEN_EXPIRATION_TIME.getValue());
    }

    // accessToken과 refreshToken 생성에 공통적으로 사용되는 토큰 생성 함수
    private String doGenerateToken(String username, long expireTime) {
        Claims claims = Jwts.claims(); // Claims : JWT payload 에 저장되는 정보단위.
        claims.put("username", username); // 정보는 key / value 쌍으로 저장된다.

        return Jwts.builder()
                .setClaims(claims) // 정보 저장
                .setIssuedAt(new Date(System.currentTimeMillis())) // 토큰 발행 시간 정보
                .setExpiration(new Date(System.currentTimeMillis() + expireTime)) // set Expire Time
                .signWith(getSigningKey(SECRET_KEY), SignatureAlgorithm.HS256) // 사용할 암호화 알고리즘과 signature 에 들어갈 secret값 세팅
                .compact();
    }

    // 토큰의 유효성 + 만료일자 확인
    public Boolean validateToken(String token, UserDetails userDetails) {
        String username = getUsername(token);
        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    // JWT 토큰에서 인증 정보 조회
    public long getRemainMilliSeconds(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        Date now = new Date();
        return expiration.getTime() - now.getTime();
    }
}
