package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.LoginReq;
import com.ssafy.alpaca.api.request.PasswordUpdateReq;
import com.ssafy.alpaca.api.request.SignupReq;
import com.ssafy.alpaca.api.request.UserUpdateReq;
import com.ssafy.alpaca.api.response.LoginRes;
import com.ssafy.alpaca.api.response.TokenRes;
import com.ssafy.alpaca.api.response.UserListRes;
import com.ssafy.alpaca.common.exception.FileConvertException;
import com.ssafy.alpaca.common.exception.UnAuthorizedException;
import com.ssafy.alpaca.common.jwt.LogoutAccessToken;
import com.ssafy.alpaca.common.jwt.RefreshToken;
import com.ssafy.alpaca.common.util.ConvertUtil;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.common.util.JwtTokenUtil;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.ssafy.alpaca.common.jwt.JwtExpirationEnums.REFRESH_TOKEN_EXPIRATION_TIME;
import static com.ssafy.alpaca.common.jwt.JwtExpirationEnums.REISSUE_EXPIRATION_TIME;


@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final MyStudyRepository myStudyRepository;
    private final CodeRepository codeRepository;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final LogoutAccessTokenRedisRepository logoutAccessTokenRedisRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final ConvertUtil convertUtil;

    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        return principal.getUsername();
    }

    public User getCurrentUser() {
        return userRepository.findByUsername(getCurrentUsername()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
    }

    public void checkUsername(String username) {
        if (Boolean.TRUE.equals(userRepository.existsByUsername(username))) {
            throw new NullPointerException(ExceptionUtil.USER_ID_DUPLICATE);
        }
    }

    public void checkNickname(String nickname) {
        if (Boolean.TRUE.equals(userRepository.existsByNickname(nickname))) {
            throw new NullPointerException(ExceptionUtil.USER_NICKNAME_DUPLICATE);
        }
    }

    public void checkBojId(String bojId) {
        if (Boolean.TRUE.equals(userRepository.existsByBojId(bojId))) {
            throw new NullPointerException(ExceptionUtil.USER_ID_DUPLICATE);
        }
    }

    public void signup(SignupReq signupReq) {
        if (!signupReq.getPassword().equals(signupReq.getPasswordCheck())) {
            throw new UnAuthorizedException(ExceptionUtil.USER_PW_INVALID);
        }

        if (!Pattern.matches("^[a-zA-Z0-9]*$", signupReq.getUsername())) {
            throw new IllegalArgumentException(ExceptionUtil.NOT_VALID_USERNAME);
        }

        if (!Pattern.matches("^[a-zA-Z0-9!@#$%^*+=-]*$", signupReq.getPassword())) {
            throw new IllegalArgumentException(ExceptionUtil.NOT_VALID_SIGNUP);
        }

        if (Boolean.TRUE.equals(userRepository.existsByUsername(signupReq.getUsername()))) {
            throw new NullPointerException(ExceptionUtil.USER_ID_DUPLICATE);
        }

        if (Boolean.TRUE.equals(userRepository.existsByNickname(signupReq.getNickname()))) {
            throw new NullPointerException(ExceptionUtil.USER_NICKNAME_DUPLICATE);
        }

        userRepository.save(
                User.builder()
                        .username(signupReq.getUsername())
                        .password(passwordEncoder.encode(signupReq.getPassword()))
                        .nickname(signupReq.getNickname())
                        .info(signupReq.getNickname() + "님을 소개해주세요.")
                        .bojId(signupReq.getBojId())
                        .build());
    }

    public TokenRes login(LoginReq loginReq) {
        User user = userRepository.findByUsername(loginReq.getUsername())
                .orElseThrow(() -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        checkPassword(loginReq.getPassword(), user.getPassword());

        String username = user.getUsername();
        String accessToken = jwtTokenUtil.generateAccessToken(username);
        RefreshToken refreshToken = saveRefreshToken(username);
        return TokenRes.of(accessToken, refreshToken.getToken());
    }

    public LoginRes getMyInfo(String username, TokenRes tokenRes) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));

        return LoginRes.builder()
                .grantType(tokenRes.getGrantType())
                .accessToken(tokenRes.getAccessToken())
                .refreshToken(tokenRes.getRefreshToken())
                .userId(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .info(user.getInfo())
                .profileImg(convertUtil.convertByteArrayToString(user.getProfileImg()))
                .bojId(user.getBojId())
                .theme(user.getTheme())
                .preferredLanguage(user.getPreferredLanguage())
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
            throw new UnAuthorizedException(ExceptionUtil.USER_PW_INVALID);
        }
    }

    private RefreshToken saveRefreshToken(String username) {
        return refreshTokenRedisRepository.save(RefreshToken.createRefreshToken(username,
                jwtTokenUtil.generateRefreshToken(username), REFRESH_TOKEN_EXPIRATION_TIME.getValue()));
    }

    public TokenRes reissue(String refreshToken) {
        refreshToken = resolveToken(refreshToken);
        String username = jwtTokenUtil.getUsername(refreshToken);
        RefreshToken redisRefreshToken = refreshTokenRedisRepository.findById(username)
                .orElseThrow(()->new UnAuthorizedException(ExceptionUtil.INVALID_REFRESH_TOKEN));
        if (refreshToken.equals(redisRefreshToken.getToken())) {
            return reissueRefreshToken(refreshToken, username);
        }
        throw new UnAuthorizedException(ExceptionUtil.MISMATCH_REFRESH_TOKEN);
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

    // 아래부터 UserController
    public void updateUser(Long id, UserUpdateReq userUpdateReq) {
        User user = userRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        String username = getCurrentUsername();
        if (!user.getUsername().equals(username)) {
            throw new UnAuthorizedException(ExceptionUtil.NOT_MYSELF);
        }
        user.setNickname(userUpdateReq.getNickname());
        user.setInfo(userUpdateReq.getInfo());
        user.setTheme(userUpdateReq.getTheme());
        user.setPreferredLanguage(userUpdateReq.getPreferredLanguage());
        userRepository.save(user);
    }

    public String updateProfileImg(Long id, MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        String username = getCurrentUsername();
        if (!username.equals(user.getUsername())) {
            throw new UnAuthorizedException(ExceptionUtil.NOT_MYSELF);
        }
        try {
            Byte[] bytes = new Byte[file.getBytes().length];

            int i = 0;

            for (byte b : file.getBytes()) {
                bytes[i++] = b;
            }
            user.setProfileImg(bytes);
            userRepository.save(user);

            return convertUtil.convertByteArrayToString(user.getProfileImg());

        } catch (IOException e) {
            throw new FileConvertException(ExceptionUtil.FILE_NOT_CONVERT,e);
        }

    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        String username = getCurrentUsername();
        if (!user.getUsername().equals(username)) {
            throw new UnAuthorizedException(ExceptionUtil.NOT_MYSELF);
        }

        if (Boolean.TRUE.equals(myStudyRepository.existsByUserAndIsRoomMaker(user, true))) {
            throw new IllegalArgumentException(ExceptionUtil.ROOMMAKER_CANNOT_RESIGN);
        }

        codeRepository.deleteAll(codeRepository.findAllByUserId(id));
        userRepository.delete(user);
    }

    public List<UserListRes> getByNickname(String nickname) {
        String username = getCurrentUsername();
        User me = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        if (nickname.isBlank()) {
            throw new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND);
        }
        List<User> userList = userRepository.findTop10ByNicknameStartingWithAndIdNotOrderByNicknameDesc(nickname, me.getId());

        return userList.stream().map(user -> UserListRes.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .profileImg(convertUtil.convertByteArrayToString(user.getProfileImg()))
                .build())
                .collect(Collectors.toList());
    }

    public void updatePassword(Long id, PasswordUpdateReq passwordUpdateReq) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        checkPassword(passwordUpdateReq.getPassword(), user.getPassword());

        String username = getCurrentUsername();
        if (!user.getUsername().equals(username)) {
            throw new UnAuthorizedException(ExceptionUtil.NOT_MYSELF);
        }
        if (!passwordUpdateReq.getChangedPassword().equals(passwordUpdateReq.getChangedPasswordCheck())){
            throw new IllegalArgumentException(ExceptionUtil.NOT_VALID_VALUE);
        }
        if (passwordUpdateReq.getChangedPassword().equals(passwordUpdateReq.getPassword())){
            throw new IllegalArgumentException(ExceptionUtil.NOT_VALID_VALUE);
        }
        user.setPassword(passwordEncoder.encode(passwordUpdateReq.getChangedPassword()));
        userRepository.save(user);
    }
}

