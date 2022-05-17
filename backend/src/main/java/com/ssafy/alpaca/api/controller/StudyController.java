package com.ssafy.alpaca.api.controller;


import com.ssafy.alpaca.api.request.*;
import com.ssafy.alpaca.api.response.*;
import com.ssafy.alpaca.api.service.NotificationService;
import com.ssafy.alpaca.api.service.StudyService;
import com.ssafy.alpaca.api.service.UserService;
import com.ssafy.alpaca.common.etc.BaseResponseBody;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/study")
@RequiredArgsConstructor
public class StudyController {

    private final UserService userService;
    private final StudyService studyService;
    private final NotificationService notificationService;

    @ApiOperation(
            value = "스터디 개설",
            notes = "입력 정보에 따라 새로운 스터디를 생성한다."
    )
    @PostMapping
    public ResponseEntity<StudyListRes> createStudy(@RequestBody StudyReq studyReq) {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(studyService.createStudy(username, studyReq));
    }

    @ApiOperation(
            value = "스터디 핀 고정",
            notes = "요청에 따라 지정한 스터디를 가장 앞으로 옮긴다."
    )
    @ApiImplicitParam( name = "id", value = "고정할 스터디의 id", dataTypeClass = Long.class )
    @PostMapping("/{id}")
    public ResponseEntity<List<StudyListRes>> setPin(@PathVariable Long id, @RequestParam Long limit) {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(studyService.setPin(username, id, limit));
    }

    @ApiOperation(
            value = "스터디 조회",
            notes = "요청한 스터디 id에 따라 스터디룸의 정보를 조회한다."
    )
    @ApiImplicitParams({
        @ApiImplicitParam( name = "id", value = "조회할 스터디의 id", dataTypeClass = Long.class ),
        @ApiImplicitParam( name = "offset", value = "표준시간대로부터 offset", dataTypeClass = Integer.class )
    })
    @GetMapping("/{id}")
    public ResponseEntity<StudyRes> getStudy(@PathVariable Long id, @RequestParam Integer offset) {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(studyService.getStudy(username, id, offset));
    }

    @ApiOperation(
            value = "스터디 추가 조회",
            notes = "pageable에 해당하는 스터디를 3개단위로 조회한다."
    )
    @GetMapping
    public ResponseEntity<Page<StudyListRes>> getMoreStudy(
            @PageableDefault(size = 3, sort = "pinnedTime", direction = Sort.Direction.DESC)Pageable pageable) {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(studyService.getMoreStudy(username, pageable));
    }

    @ApiOperation(
            value = "스터디 일정 리스트 조회",
            notes = "특정 기간 (year, month, day)의 스터디 일정을 조회한다."
    )
    @ApiImplicitParams({
            @ApiImplicitParam( name = "year", value = "시작하는 해", dataTypeClass = Long.class ),
            @ApiImplicitParam( name = "month", value = "시작하는 달", dataTypeClass = Long.class ),
            @ApiImplicitParam( name = "day", value = "시작하는 날짜", dataTypeClass = Long.class ),
            @ApiImplicitParam( name = "offset", value = "표준시간대로부터 offset", dataTypeClass = Integer.class )
    })
    @GetMapping("/span")
    public ResponseEntity<List<ScheduleListRes>> getScheduleList(
            @RequestParam Integer year, @RequestParam Integer month, @RequestParam(required = false) Integer day, @RequestParam Integer offset) {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(studyService.getScheduleList(username, year, month, day, offset));
    }

    @ApiOperation(
            value = "스터디 전체 문제 조회",
            notes = "스터디 일정에 등록된 모든 문제를 조회한다."
    )
    @ApiImplicitParam( name = "id", value = "조회할 스터디의 id", dataTypeClass = Long.class )
    @GetMapping("/{id}/problems")
    public ResponseEntity<List<ProblemListRes>> getStudyProblem(@PathVariable Long id){
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(studyService.getStudyProblem(username, id));
    }

    @ApiOperation(
            value = "스터디 수정",
            notes = "스터디 제목과 정보를 수정한다."
    )
    @ApiImplicitParam( name = "id", value = "수정할 스터디의 id", dataTypeClass = Long.class )
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponseBody> updateStudy(@PathVariable Long id, @RequestBody StudyUpdateReq studyUpdateReq) {
        String username = userService.getCurrentUsername();
        studyService.updateStudy(username, id, studyUpdateReq);
        return ResponseEntity.ok(BaseResponseBody.of(200,"OK"));
    }

    @ApiOperation(
            value = "스터디 삭제",
            notes = "요청한 스터디 id에 따라 스터디를 삭제한다."
    )
    @ApiImplicitParam( name = "id", value = "삭제할 스터디의 id", dataTypeClass = Long.class )
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponseBody> deleteStudy(@PathVariable Long id) {
        String username = userService.getCurrentUsername();
        studyService.deleteStudy(username, id);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    // 이하 스터디 멤버 관리 코드

    @ApiOperation(
            value = "같은 스터디원인지 확인",
            notes = "특정 회원과 로그인된 유저가 같은 스터디에 가입되어있는지 확인한다."
    )
    @ApiImplicitParams({
        @ApiImplicitParam( name = "studyId", value = "스터디 id", dataTypeClass = Long.class ),
        @ApiImplicitParam( name = "userId", value = "확인할 유저 id", dataTypeClass = Long.class )
    })
    @GetMapping("/checkMember/{studyId}/{userId}")
    public ResponseEntity<BaseResponseBody> checkMember(@PathVariable Long studyId, @PathVariable Long userId) {
        String username = userService.getCurrentUsername();
        studyService.checkMember(username, userId, studyId);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "스터디 방장 권한 위임",
            notes = "요청 유저에게 방장 권한을 넘겨준다."
    )
    @ApiImplicitParam( name = "id", value = "이임할 스터디의 id", dataTypeClass = Long.class )
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
    @ApiImplicitParam( name = "id", value = "강퇴할 스터디의 id", dataTypeClass = Long.class )
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
    @ApiImplicitParam( name = "id", value = "탈퇴할 스터디의 id", dataTypeClass = Long.class )
    @DeleteMapping("/exit/{id}")
    public ResponseEntity<BaseResponseBody> deleteMeFromStudy(@PathVariable Long id) {
        String username = userService.getCurrentUsername();
        studyService.deleteMeFromStudy(username, id);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    // 이하 초대 관련 코드

    @ApiOperation(
            value = "초대코드 조회",
            notes = "현재 스터디의 초대코드를 조회하고 / 만료되었다면 생성하여 반환한다."
    )
    @ApiImplicitParam( name = "id", value = "초대코드를 조회할 스터디의 id", dataTypeClass = Long.class )
    @GetMapping("/{id}/inviteCode")
    public ResponseEntity<BaseResponseBody> createInviteCode(@PathVariable Long id) {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(BaseResponseBody.of(200,studyService.createInviteCode(username, id)));
    }

    @ApiOperation(
            value = "초대코드로 스터디 정보 조회",
            notes = "주어진 초대코드를 통해 스터디의 방장과 스터디 정보를 조회한다."
    )
    @ApiImplicitParam( name = "inviteCode", value = "초대코드", dataTypeClass = String.class )
    @GetMapping("/inviteInfo")
    public ResponseEntity<InviteInfoRes> inviteUserCode(@RequestParam String inviteCode) {
        return ResponseEntity.ok(studyService.getInviteInfo(inviteCode));
    }

    @ApiOperation(
            value = "초대코드를 통해 스터디 가입",
            notes = "스터디/초대코드 정보에 따라 스터디에 가입시킨다."
    )
    @PostMapping("/inviteCode")
    public ResponseEntity<BaseResponseBody> inviteUserCode(@RequestBody StudyInviteReq studyInviteReq) {
        String username = userService.getCurrentUsername();
        studyService.inviteUserCode(username, studyInviteReq);
        return ResponseEntity.ok(BaseResponseBody.of(200,"OK"));
    }

    @ApiOperation(
            value = "스터디 초대",
            notes = "방장이 스터디에 사용자를 초대한다."
    )
    @PostMapping("/{id}/invite")
    public ResponseEntity<BaseResponseBody> inviteUser(@PathVariable Long id, @RequestBody StudyMemberReq studyMemberReq) {
        String username = userService.getCurrentUsername();
        notificationService.notifyAddStudyEvent(username, id, studyMemberReq);
        return ResponseEntity.ok(BaseResponseBody.of(200,"OK"));
    }

    @ApiOperation(
            value = "스터디 초대",
            notes = "방장이 스터디에 사용자를 초대한다."
    )
    @ApiImplicitParam( name = "id", value = "가입할 스터디 id", dataTypeClass = Long.class )
    @PostMapping("/{id}/join")
    public ResponseEntity<StudyListRes> joinStudy(@PathVariable Long id) {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(studyService.joinStudy(username, id));
    }

}