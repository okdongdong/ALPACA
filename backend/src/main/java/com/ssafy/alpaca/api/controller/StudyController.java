package com.ssafy.alpaca.api.controller;


import com.ssafy.alpaca.api.response.StudyRes;
import com.ssafy.alpaca.api.service.StudyService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/study")
@RequiredArgsConstructor
public class StudyController {

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
            value = "Study 삭제",
            notes = "특정 스터디를 삭제한다."
    )
    @DeleteMapping("/{id}")
    public void deleteStudy(@PathVariable String id) { studyService.deleteStudy(id);}

}