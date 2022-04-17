package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.LoginReq;
import com.ssafy.alpaca.api.request.SignupReq;
import com.ssafy.alpaca.api.response.MyInfoRes;
import com.ssafy.alpaca.api.response.TokenRes;
import com.ssafy.alpaca.common.jwt.LogoutAccessToken;
import com.ssafy.alpaca.common.jwt.RefreshToken;
import com.ssafy.alpaca.common.util.JwtTokenUtil;
import com.ssafy.alpaca.db.document.User;
import com.ssafy.alpaca.db.repository.LogoutAccessTokenRedisRepository;
import com.ssafy.alpaca.db.repository.RefreshTokenRedisRepository;
import com.ssafy.alpaca.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

import static com.ssafy.alpaca.common.jwt.JwtExpirationEnums.REFRESH_TOKEN_EXPIRATION_TIME;
import static com.ssafy.alpaca.common.jwt.JwtExpirationEnums.REISSUE_EXPIRATION_TIME;


@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final LogoutAccessTokenRedisRepository logoutAccessTokenRedisRepository;


    public String signup(SignupReq signupReq) {
        if (!signupReq.getPassword().equals(signupReq.getPasswordCheck())) {
            throw new IllegalArgumentException("ExceptionUtil.USER_PW_INVALID");
        }

        User user = userRepository.save(
                User.builder()
                        .username(signupReq.getUsername())
                        .password(passwordEncoder.encode(signupReq.getPassword()))
                        .build());

        return "가입성공";
    }

    public TokenRes login(LoginReq loginReq) {
        User user = userRepository.findByUsername(loginReq.getUsername())
                .orElseThrow(() -> new NoSuchElementException("ExceptionUtil.USER_NOT_FOUND"));
        checkPassword(loginReq.getPassword(), user.getPassword());

        String username = user.getUsername();
        String accessToken = jwtTokenUtil.generateAccessToken(username);
        RefreshToken refreshToken = saveRefreshToken(username);
        return TokenRes.of(accessToken, refreshToken.getToken());
    }

    public MyInfoRes getMyInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("ExceptionUtil.USER_NOT_FOUND"));
        return MyInfoRes.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
//                .profileImg(convertUtil.convertByteArrayToString(user.getProfileImg()))
                .build();
    }

    public void logout(TokenRes tokenRes, String username) {
        String accessToken = resolveToken(tokenRes.getAccessToken());
        long remainMilliSeconds = jwtTokenUtil.getRemainMilliSeconds(accessToken);
        refreshTokenRedisRepository.deleteById(username);
        logoutAccessTokenRedisRepository.save(LogoutAccessToken.createLogoutAccessToken(
                accessToken, username, remainMilliSeconds));
    }

    private String resolveToken(String token) {
        return token.substring(7);
    }

    private void checkPassword(String rawPassword, String findMemberPassword) {
        if (!passwordEncoder.matches(rawPassword, findMemberPassword)) {
            throw new IllegalArgumentException("ExceptionUtil.USER_PW_INVALID");
        }
    }

    private RefreshToken saveRefreshToken(String username) {
        return refreshTokenRedisRepository.save(RefreshToken.createRefreshToken(username,
                jwtTokenUtil.generateRefreshToken(username), REFRESH_TOKEN_EXPIRATION_TIME.getValue()));
    }

    public TokenRes reissue(String refreshToken) {
        refreshToken = resolveToken(refreshToken);
        String username = jwtTokenUtil.getUsername(refreshToken);
//        RefreshToken redisRefreshToken = refreshTokenRedisRepository.findById(username)
//                .orElseThrow(()->new IllegalArgumentException(ExceptionUtil.INVALID_REFRESH_TOKEN));
        RefreshToken redisRefreshToken = refreshTokenRedisRepository.findById(username)
                .orElseThrow(()->new IllegalArgumentException("ExceptionUtil.INVALID_REFRESH_TOKEN"));
        if (refreshToken.equals(redisRefreshToken.getToken())) {
            return reissueRefreshToken(refreshToken, username);
        }
        throw new IllegalArgumentException("ExceptionUtil.MISMATCH_REFRESH_TOKEN");
    }

    private TokenRes reissueRefreshToken(String refreshToken, String username) {
        // 토큰이 만료되었으면
        if (lessThanReissueExpirationTimesLeft(refreshToken)) {
            String accessToken = jwtTokenUtil.generateAccessToken(username);
            // accessToken, refreshToken 재생성
            return TokenRes.of(accessToken, saveRefreshToken(username).getToken());
        }
        // accessToken만 재생성
        return TokenRes.of(jwtTokenUtil.generateAccessToken(username), refreshToken);
    }

    private boolean lessThanReissueExpirationTimesLeft(String refreshToken) {
        return jwtTokenUtil.getRemainMilliSeconds(refreshToken) < REISSUE_EXPIRATION_TIME.getValue();
    }
}

