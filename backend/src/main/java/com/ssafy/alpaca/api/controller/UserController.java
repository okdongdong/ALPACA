package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.PasswordUpdateReq;
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

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @ApiOperation(
            value = "회원정보 수정",
            notes = "사용자 입력 정보에 따라 회원정보를 수정한다."
    )
    @ApiImplicitParam( name = "id", value = "수정할 사용자 id", dataTypeClass = Long.class )
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponseBody> updateUser(
            @PathVariable Long id, @RequestBody UserUpdateReq userUpdateReq) throws IllegalAccessException {
        userService.updateUser(id, userUpdateReq);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "회원정보 삭제(탈퇴)",
            notes = "요청 회원을 탈퇴처리한다."
    )
    @ApiImplicitParam( name = "id", value = "삭제할 사용자 id", dataTypeClass = Long.class )
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponseBody> deleteUser(@PathVariable Long id) throws IllegalAccessException {
        userService.deleteUser(id);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "프로필 이미지 변경",
            notes = "요청한 회원의 프로필 이미지를 변경한다."
    )
    @ApiImplicitParam( name = "id", value = "변경할 사용자 id", dataTypeClass = Long.class )
    @PostMapping("/{id}/profile")
    public ResponseEntity<BaseResponseBody> updateProfileImg(
            @PathVariable Long id, @RequestParam MultipartFile file) throws IOException, IllegalAccessException {
        return ResponseEntity.ok(BaseResponseBody.of(200, userService.updateProfileImg(id, file)));
    }

    @ApiOperation(
            value = "닉네임으로 회원 검색",
            notes = "요청 키워드로 시작하는 닉네임의 회원들을 모두 보여준다."
    )
    @ApiImplicitParam( name = "nickname", value = "검색할 닉네임" , dataTypeClass = String.class )
    @GetMapping("/search")
    public ResponseEntity<List<UserListRes>> getUserListByNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(userService.getByNickname(nickname));
    }

    @ApiOperation(
            value = "비밀번호 변경",
            notes = "사용자의 비밀번호를 변경한다."
    )
    @ApiImplicitParam( name = "id", value = "변경할 사용자 id", dataTypeClass = Long.class )
    @PutMapping("/changePassword/{id}")
    public ResponseEntity<BaseResponseBody> updatePassword(
            @PathVariable Long id,@RequestBody PasswordUpdateReq passwordUpdateReq) throws IllegalAccessException {
        userService.updatePassword(id, passwordUpdateReq);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

}
