package com.ssafy.alpaca.api.controller;


import com.ssafy.alpaca.api.request.StudyInviteReq;
import com.ssafy.alpaca.api.request.StudyMemberReq;
import com.ssafy.alpaca.api.request.StudyReq;
import com.ssafy.alpaca.api.request.StudyUpdateReq;
import com.ssafy.alpaca.api.response.ProblemListRes;
import com.ssafy.alpaca.api.response.StudyListRes;
import com.ssafy.alpaca.api.response.StudyRes;
import com.ssafy.alpaca.api.service.StudyService;
import com.ssafy.alpaca.api.service.UserService;
import com.ssafy.alpaca.common.etc.BaseResponseBody;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/study")
@RequiredArgsConstructor
public class StudyController {

    private final UserService userService;
    private final StudyService studyService;

    @ApiOperation(
            value = "스터디 조회",
            notes = "요청한 스터디 id에 따라 스터디룸의 정보를 조회한다."
    )
    @GetMapping("/{id}")
    public ResponseEntity<StudyRes> getStudy(@PathVariable Long id) {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(studyService.getStudy(username, id));
    }

    @ApiOperation(
            value = "스터디 추가 조회",
            notes = "pageable에 해당하는 스터디를 3개단위로 조회한다."
    )
    @GetMapping()
    public ResponseEntity<Page<StudyListRes>> getMoreStudy(
            @PageableDefault(size = 3, sort = "pinnedTime", direction = Sort.Direction.DESC)Pageable pageable) {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(studyService.getMoreStudy(username, pageable));
    }

    @ApiOperation(
            value = "스터디 개설",
            notes = "입력 정보에 따라 새로운 스터디를 생성한다."
    )
    @PostMapping()
    public ResponseEntity<BaseResponseBody> createStudy(@RequestBody StudyReq studyReq) throws IllegalAccessException {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(BaseResponseBody.of(200, studyService.createStudy(username, studyReq)));
    }

    @ApiOperation(
            value = "스터디 방장 권한 위임",
            notes = "요청 유저에게 방장 권한을 넘겨준다."
    )
    @ApiImplicitParam( name = "id", value = "이임할 스터디의 id")
    @PutMapping("/member/{id}")
    public ResponseEntity<BaseResponseBody> updateRoomMaker(@PathVariable Long id, @RequestBody StudyMemberReq studyMemberReq) {
        String username = userService.getCurrentUsername();
        studyService.updateRoomMaker(username, id, studyMemberReq);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "스터디원 강퇴",
            notes = "방장의 요청에 의해, 소속된 스터디원을 강퇴한다."
    )
    @ApiImplicitParam( name = "id", value = "강퇴할 스터디의 id")
    @DeleteMapping("/member/{id}")
    public ResponseEntity<BaseResponseBody> deleteMember(@PathVariable Long id, @RequestBody StudyMemberReq studyMemberReq) {
        String username = userService.getCurrentUsername();
        studyService.deleteMember(username, id, studyMemberReq);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "스터디 탈퇴",
            notes = "요청한 스터디의 방장이 아닐 경우, 스터디에서 탈퇴한다."
    )
    @ApiImplicitParam( name = "id", value = "탈퇴할 스터디의 id")
    @DeleteMapping("/exit/{id}")
    public ResponseEntity<BaseResponseBody> deleteMeFromStudy(@PathVariable Long id) {
        String username = userService.getCurrentUsername();
        studyService.deleteMeFromStudy(username, id);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "스터디 삭제",
            notes = "요청한 스터디 id에 따라 스터디를 삭제한다."
    )
    @ApiImplicitParam( name = "id", value = "삭제할 스터디의 id")
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponseBody> deleteStudy(@PathVariable Long id) {
        String username = userService.getCurrentUsername();
        studyService.deleteStudy(username, id);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "스터디 수정",
            notes = "스터디 제목과 정보를 수정한다."
    )
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponseBody> updateStudy(@PathVariable Long id, @RequestBody StudyUpdateReq studyUpdateReq) {
        String username = userService.getCurrentUsername();
        studyService.updateStudy(username, id, studyUpdateReq);
        return ResponseEntity.ok(BaseResponseBody.of(200,"OK"));
    }

    @ApiOperation(
            value = "스터디 전체 문제 조회",
            notes = "스터디 일정에 등록된 모든 문제를 조회한다."
    )
    @GetMapping("/{id}/problems")
    public ResponseEntity<List<ProblemListRes>> getStudyProblem(@PathVariable Long id){
        return ResponseEntity.ok(studyService.getStudyProblem(id));
    }

    @ApiOperation(
            value = "스터디 초대 ",
            notes = "방장이 스터디에 사용자를 초대한다."
    )
    @PostMapping("/{id}/invite")
    public ResponseEntity<BaseResponseBody> inviteUser(@PathVariable Long id, @RequestBody StudyMemberReq studyMemberReq){
        String username = userService.getCurrentUsername();
        studyService.inviteStudy(username, id, studyMemberReq);
        return ResponseEntity.ok(BaseResponseBody.of(200,"OK"));
    }

    @ApiOperation(
            value = "초대코드 생성 ",
            notes = "초대코드를 생성한다."
    )
    @GetMapping("/{id}/inviteCode")
    public ResponseEntity<BaseResponseBody> createInviteCode(@PathVariable Long id){
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(BaseResponseBody.of(200,studyService.createInviteCode(username, id)));
    }

    @ApiOperation(
            value = "초대코드로 스터디 등록 ",
            notes = "초대코드로 스터디에 등록한다."
    )
    @PostMapping("/{id}/inviteCode")
    public ResponseEntity<BaseResponseBody> inviteUserCode(@PathVariable Long id, @RequestBody StudyInviteReq studyInviteReq){
        String username = userService.getCurrentUsername();
        studyService.inviteUserCode(username, id, studyInviteReq);
        return ResponseEntity.ok(BaseResponseBody.of(200,"OK"));
    }
}