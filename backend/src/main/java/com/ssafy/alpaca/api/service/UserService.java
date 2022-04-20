package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.LoginReq;
import com.ssafy.alpaca.api.request.SignupReq;
import com.ssafy.alpaca.api.request.UserUpdateReq;
import com.ssafy.alpaca.api.response.MyInfoRes;
import com.ssafy.alpaca.api.response.TokenRes;
import com.ssafy.alpaca.api.response.UserListRes;
import com.ssafy.alpaca.common.jwt.LogoutAccessToken;
import com.ssafy.alpaca.common.jwt.RefreshToken;
import com.ssafy.alpaca.common.util.ConvertUtil;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.common.util.JwtTokenUtil;
import com.ssafy.alpaca.db.document.User;
import com.ssafy.alpaca.db.repository.LogoutAccessTokenRedisRepository;
import com.ssafy.alpaca.db.repository.RefreshTokenRedisRepository;
import com.ssafy.alpaca.db.repository.StudyRepository;
import com.ssafy.alpaca.db.repository.UserRepository;
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
import java.util.stream.Collectors;

import static com.ssafy.alpaca.common.jwt.JwtExpirationEnums.REFRESH_TOKEN_EXPIRATION_TIME;
import static com.ssafy.alpaca.common.jwt.JwtExpirationEnums.REISSUE_EXPIRATION_TIME;


@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final LogoutAccessTokenRedisRepository logoutAccessTokenRedisRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final ConvertUtil convertUtil;

    private Map<String, String> getMessage(String message) {
        Map<String, String> map = new HashMap<>();
        map.put("message", message);
        return map;
    }

    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        return principal.getUsername();
    }

    public Map<String, String> checkUsername(String username) {
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.USER_ID_DUPLICATE);
        }
        return getMessage("사용할 수 있는 ID입니다.");
    }

    public Map<String, String> checkNickname(String nickname) {
        if (userRepository.existsByNickname(nickname)) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.USER_NICKNAME_DUPLICATE);
        }
        return getMessage("사용할 수 있는 닉네임입니다.");
    }

    public Map<String, String> checkBojId(String bojId) {
        String message;
        if (userRepository.existsByBojId(bojId)) {
            message = "해당 계정으로 이미 연동된 ID가 있습니다.";
        } else {
            message = "해당 계정으로 연동된 ID가 없습니다.";
        }
        return getMessage(message);
    }

    public Map<String, String> signup(SignupReq signupReq) throws IllegalAccessException {
        if (signupReq.getBojId().isEmpty()) {
            throw new IllegalAccessException(ExceptionUtil.NOT_VALID_VALUE);
        }

        if (!signupReq.getPassword().equals(signupReq.getPasswordCheck())) {
            throw new IllegalArgumentException(ExceptionUtil.USER_PW_INVALID);
        }

        if (userRepository.existsByUsername(signupReq.getUsername())) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.USER_ID_DUPLICATE);
        }

        if (userRepository.existsByNickname(signupReq.getNickname())) {
            throw new DuplicateFormatFlagsException(ExceptionUtil.USER_NICKNAME_DUPLICATE);
        }

        userRepository.save(
                User.builder()
                        .username(signupReq.getUsername())
                        .password(passwordEncoder.encode(signupReq.getPassword()))
                        .nickname(signupReq.getNickname())
                        .info("자신에 대한 정보를 입력해주세요.")
                        .theme("basic")
                        .bojId(signupReq.getBojId())
                        .build());

        return getMessage("성공적으로 가입되었습니다.");
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

    public MyInfoRes getMyInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        return MyInfoRes.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .profileImg(convertUtil.convertByteArrayToString(user.getProfileImg()))
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
                .orElseThrow(()->new IllegalArgumentException(ExceptionUtil.INVALID_REFRESH_TOKEN));
        if (refreshToken.equals(redisRefreshToken.getToken())) {
            return reissueRefreshToken(refreshToken, username);
        }
        throw new IllegalArgumentException(ExceptionUtil.MISMATCH_REFRESH_TOKEN);
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
    public Map<String, String> updateUser(String id, UserUpdateReq userUpdateReq) throws IllegalAccessException {
        User user = userRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        String username = getCurrentUsername();
        if (!user.getUsername().equals(username)) {
            throw new IllegalAccessException(ExceptionUtil.NOT_MYSELF);
        }
        user.setNickname(userUpdateReq.getNickname());
        user.setInfo(userUpdateReq.getInfo());
        user.setTheme(userUpdateReq.getTheme());
        user.setPreferredLanguage(userUpdateReq.getPreferredLanguage());
        userRepository.save(user);
        return getMessage("성공적으로 수정되었습니다.");
    }

    public Map<String,String> updateProfileImg(String id, MultipartFile file) throws IllegalAccessException, IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        String username = getCurrentUsername();
        if (!username.equals(user.getUsername())) {
            throw new IllegalAccessException(ExceptionUtil.NOT_MYSELF);
        }
        Byte[] bytes = new Byte[file.getBytes().length];

        int i = 0;

        for (byte b : file.getBytes()) {
            bytes[i++] = b;
        }
        user.setProfileImg(bytes);
        userRepository.save(user);


        Map<String, String> map = new HashMap<>();
        map.put("profileImg", convertUtil.convertByteArrayToString(user.getProfileImg()));
        return map;

    }

    public void deleteUser(String id) throws IllegalAccessException {
        User user = userRepository.findById(id).orElseThrow(() -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        String username = getCurrentUsername();
        if (!user.getUsername().equals(username)) {
            throw new IllegalAccessException(ExceptionUtil.NOT_MYSELF);
        }

        if (studyRepository.existsByRoomMaker(user)) {
            throw new IllegalAccessException(ExceptionUtil.ROOMMAKER_CANNOT_RESIGN);
        }
        userRepository.delete(user);
    }

    public List<UserListRes> getByNickname(String nickname) {
        List<User> userList = userRepository.findAllByNicknameContains(nickname);

        return userList.stream().map(user -> UserListRes.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .profileImg(convertUtil.convertByteArrayToString(user.getProfileImg()))
                .build())
                .collect(Collectors.toList());
    }

}
