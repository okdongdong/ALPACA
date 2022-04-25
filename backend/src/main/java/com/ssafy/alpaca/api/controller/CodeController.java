package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.CodeSaveReq;
import com.ssafy.alpaca.api.service.CodeService;
import com.ssafy.alpaca.common.etc.BaseResponseBody;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/code")
@RequiredArgsConstructor
public class CodeController {

    private final CodeService codeService;

    @ApiOperation(
            value = "코드 등록",
            notes = "컴파일한 코드를 저장한다."
    )
    @PostMapping()
    public ResponseEntity<? extends BaseResponseBody> createCode(@RequestBody CodeSaveReq codeSaveReq) throws IllegalAccessException{
        codeService.createCode(codeSaveReq);
        return ResponseEntity.ok(BaseResponseBody.of(200,"OK"));
    }
}
