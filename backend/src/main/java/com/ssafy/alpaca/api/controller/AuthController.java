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

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupReq signupReq) {
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
