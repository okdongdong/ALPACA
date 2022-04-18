package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.UserUpdateReq;
import com.ssafy.alpaca.api.service.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Map<String, String>> updateUser(
            @PathVariable String id, @RequestBody UserUpdateReq userUpdateReq) {
        return ResponseEntity.ok(userService.updateUser(id, userUpdateReq));
    }

}
