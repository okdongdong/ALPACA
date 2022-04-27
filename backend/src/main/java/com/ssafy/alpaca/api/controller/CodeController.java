package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.CodeCompileWithInputReq;
import com.ssafy.alpaca.api.request.CodeReq;
import com.ssafy.alpaca.api.request.CodeCompileReq;
import com.ssafy.alpaca.api.service.CodeService;
import com.ssafy.alpaca.api.service.UserService;
import com.ssafy.alpaca.common.etc.BaseResponseBody;
import com.ssafy.alpaca.db.document.Code;
import com.ssafy.alpaca.api.response.CodeCompileRes;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/code")
@RequiredArgsConstructor
public class CodeController {

    private final UserService userService;
    private final CodeService codeService;

    @ApiOperation(
            value = "input에 의한 컴파일",
            notes = "input에 따라 코드를 컴파일한다."
    )
    @PostMapping("/compile")
    public ResponseEntity<BaseResponseBody> compileCode(
            @RequestBody CodeCompileWithInputReq codeCompileWithInputReq) {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(BaseResponseBody.of(200, codeService.compileCode(username, codeCompileWithInputReq)));
    }

    @ApiOperation(
            value = "예제코드 컴파일",
            notes = "BOJ 예제 입력으로 코드를 컴파일한다."
    )
    @PostMapping("/bojCompile")
    public ResponseEntity<CodeCompileRes> compileBojCode(
            @RequestBody CodeCompileReq codeCompileReq) throws IllegalAccessException {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(codeService.compileBojCode(username, codeCompileReq));
    }

    @ApiOperation(
            value = "코드 등록",
            notes = "현재 코드를 저장한다."
    )
    @PostMapping()
    public ResponseEntity<BaseResponseBody> createCode(@RequestBody CodeReq codeReq) {
        String username = userService.getCurrentUsername();
        codeService.createCode(username, codeReq);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "코드 조회",
            notes = "유저가 푼 특정 문제의 모든 코드를 조회한다."
    )
    @ApiImplicitParams({
        @ApiImplicitParam(name = "userId", value = "코드를 조회할 유저의 ID"),
        @ApiImplicitParam(name = "problemId", value = "코드를 조회할 문제의 ID")
    })
    @GetMapping("/{userId}")
    public ResponseEntity<List<Code>> getCode(
            @PathVariable Long userId, @RequestParam String problemId) {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(codeService.getCode(username, userId, problemId));
    }

}
