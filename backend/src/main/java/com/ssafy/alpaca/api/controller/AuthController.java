package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.LoginReq;
import com.ssafy.alpaca.api.request.SignupReq;
import com.ssafy.alpaca.api.response.LoginRes;
import com.ssafy.alpaca.api.response.MyInfoRes;
import com.ssafy.alpaca.api.response.TokenRes;
import com.ssafy.alpaca.api.service.UserService;
import com.ssafy.alpaca.common.util.JwtTokenUtil;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
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

    @ApiOperation(
            value = "ID 중복 검사",
            notes = "회원가입 단계에서, 중복된 ID가 있는지 확인한다."
    )
    @ApiImplicitParam( name = "username", value = "가입 ID" )
    @GetMapping("/duplicated/username")
    public ResponseEntity<Map<String, String>> checkUsername(@RequestParam String username) {
        return ResponseEntity.ok(userService.checkUsername(username));
    }

    @ApiOperation(
            value = "닉네임 중복 검사",
            notes = "회원가입 단계에서, 중복된 닉네임이 있는지 확인한다."
    )
    @ApiImplicitParam( name = "nickname", value = "가입 닉네임" )
    @GetMapping("/duplicated/nickname")
    public ResponseEntity<Map<String, String>> checkNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(userService.checkNickname(nickname));
    }

    @ApiOperation(
            value = "회원가입",
            notes = "사용자 입력 정보에 따른 회원가입 요청"
    )
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
