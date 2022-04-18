package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.LoginReq;
import com.ssafy.alpaca.api.request.SignupReq;
import com.ssafy.alpaca.api.response.LoginRes;
import com.ssafy.alpaca.api.response.MyInfoRes;
import com.ssafy.alpaca.api.response.TokenRes;
import com.ssafy.alpaca.api.service.UserService;
import com.ssafy.alpaca.common.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    @GetMapping("/duplicated/username")
    public ResponseEntity<Map<String, String>> checkUsername(@RequestParam String username) {
        return ResponseEntity.ok(userService.checkUsername(username));
    }

    @GetMapping("/duplicated/nickname")
    public ResponseEntity<Map<String, String>> checkNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(userService.checkNickname(nickname));
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody SignupReq signupReq) throws IllegalAccessException {
        return ResponseEntity.ok(userService.signup(signupReq));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginRes> login(@RequestBody LoginReq loginReq) {
        TokenRes tokenRes = userService.login(loginReq);
        MyInfoRes myInfoRes = userService.getMyInfo(loginReq.getUsername());
        return ResponseEntity.ok(LoginRes.of(tokenRes, myInfoRes));
    }

    @PostMapping("/logout")
    public void logout(@RequestHeader("Authorization") String accessToken, 
                       @RequestHeader("RefreshToken") String refreToken) {
        String username = jwtTokenUtil.getUsername(accessToken.substring(7));
        userService.logout(TokenRes.of(accessToken, refreToken), username);
    }

    @PostMapping("/reissue")
    public ResponseEntity<TokenRes> reissue(@RequestHeader("RefreshToken") String refreshToken) {
        return ResponseEntity.ok(userService.reissue(refreshToken));
    }
}
