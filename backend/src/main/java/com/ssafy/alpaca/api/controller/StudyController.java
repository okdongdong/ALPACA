package com.ssafy.alpaca.api.controller;


import com.ssafy.alpaca.api.request.StudyReq;
import com.ssafy.alpaca.api.response.StudyRes;
import com.ssafy.alpaca.api.service.StudyService;
import com.ssafy.alpaca.api.service.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/study")
@RequiredArgsConstructor
public class StudyController {

    private final UserService userService;
    private final StudyService studyService;

    @ApiOperation(
            value = "Study 조회",
            notes = "특정 스터디를 조회한다."
    )
    @GetMapping("/{id}")
    public ResponseEntity<StudyRes> getStudy(
            @PathVariable String id) {
        return ResponseEntity.ok(studyService.getStudy(id));
    }

    @ApiOperation(
            value = "스터디 개설",
            notes = "입력 정보에 따라 새로운 스터디를 생성한다."
    )
    @PostMapping()
    public void createStudy(@RequestBody StudyReq studyReq) {
        String username = userService.getCurrentUsername();
        studyService.createStudy(username, studyReq);
    }

    @ApiOperation(
            value = "Study 삭제",
            notes = "특정 스터디를 삭제한다."
    )
    @DeleteMapping("/{id}")
    public void deleteStudy(@PathVariable String id) {
        String username = userService.getCurrentUsername();
        studyService.deleteStudy(username, id);
    }

}