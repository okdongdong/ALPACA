package com.ssafy.alpaca.api.controller;


import com.ssafy.alpaca.api.request.StudyMemberReq;
import com.ssafy.alpaca.api.request.StudyReq;
import com.ssafy.alpaca.api.request.StudyRoomMakerUpdateReq;
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
            value = "스터디 방장 권한 위임",
            notes = "요청 유저에게 방장 권한을 넘겨준다."
    )
    @PutMapping("/roomMaker")
    public void updateRoomMaker(@RequestBody StudyRoomMakerUpdateReq studyRoomMakerUpdateReq) {
        String username = userService.getCurrentUsername();
        studyService.updateRoomMaker(username, studyRoomMakerUpdateReq);
    }

    @ApiOperation(
            value = "스터디원 강퇴",
            notes = "방장의 요청에 의해, 소속된 스터디원을 강퇴한다."
    )
    @DeleteMapping("/member/{id}")
    public void deleteMember(@PathVariable String id, @RequestBody StudyMemberReq studyMemberReq) {
        String username = userService.getCurrentUsername();
        studyService.deleteMember(username, id, studyMemberReq);
    }

    @ApiOperation(
            value = "스터디 탈퇴",
            notes = "요청한 스터디의 방장이 아닐 경우, 스터디에서 탈퇴한다."
    )
    @DeleteMapping("/exit/{id}")
    public void deleteMeFromStudy(@PathVariable String id) {
        String username = userService.getCurrentUsername();
        studyService.deleteMeFromStudy(username, id);
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