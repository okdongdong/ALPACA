package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.UserUpdateReq;
import com.ssafy.alpaca.api.response.UserListRes;
import com.ssafy.alpaca.api.service.UserService;
import com.ssafy.alpaca.common.etc.BaseResponseBody;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @ApiOperation(
            value = "회원정보 수정",
            notes = "사용자 입력 정보에 따라 회원정보를 수정한다."
    )
    @PutMapping("/{id}")
    public ResponseEntity<? extends BaseResponseBody> updateUser(
            @PathVariable String id, @RequestBody UserUpdateReq userUpdateReq) throws IllegalAccessException {
        userService.updateUser(id, userUpdateReq);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "회원정보 삭제",
            notes = "요청 회원을 탈퇴처리한다."
    )
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) throws IllegalAccessException {
        userService.deleteUser(id);
    }

    @PostMapping("/{id}/profile")
    public ResponseEntity<? extends BaseResponseBody> updateProfileImg(
            @PathVariable String id, @RequestParam MultipartFile file) throws IOException, IllegalAccessException {
        return ResponseEntity.ok(BaseResponseBody.of(200, userService.updateProfileImg(id, file)));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserListRes>> getUserListByNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(userService.getByNickname(nickname));
    }
}
