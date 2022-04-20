package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.LoginReq;
import com.ssafy.alpaca.api.request.SignupReq;
import com.ssafy.alpaca.api.response.LoginRes;
import com.ssafy.alpaca.api.response.MyInfoRes;
import com.ssafy.alpaca.api.response.TokenRes;
import com.ssafy.alpaca.api.service.UserService;
import com.ssafy.alpaca.common.etc.BaseResponseBody;
import com.ssafy.alpaca.common.util.JwtTokenUtil;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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
    public ResponseEntity<? extends BaseResponseBody> checkUsername(@RequestParam String username) {
        userService.checkUsername(username);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "닉네임 중복 검사",
            notes = "회원가입 단계에서, 중복된 닉네임이 있는지 확인한다."
    )
    @ApiImplicitParam( name = "nickname", value = "가입 닉네임" )
    @GetMapping("/duplicated/nickname")
    public ResponseEntity<? extends BaseResponseBody> checkNickname(@RequestParam String nickname) {
        userService.checkNickname(nickname);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "백준 연동 중복 검사",
            notes = "백준 계정 연동시, 이미 등록된 계정인지 확인해준다."
    )
    @ApiImplicitParam( name = "bojId", value = "연동 계정")
    @GetMapping("/duplicated/bojId")
    public ResponseEntity<? extends BaseResponseBody> checkBojId(@RequestParam String bojId) {
        return ResponseEntity.ok(BaseResponseBody.of(200, userService.checkBojId(bojId)));
    }

    @ApiOperation(
            value = "회원가입",
            notes = "사용자 입력 정보에 따른 회원가입 요청"
    )
    @PostMapping("/signup")
    public ResponseEntity<? extends BaseResponseBody> signup(@RequestBody SignupReq signupReq) throws IllegalAccessException {
        userService.signup(signupReq);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
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
