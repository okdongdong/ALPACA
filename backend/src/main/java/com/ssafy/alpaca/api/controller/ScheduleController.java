package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.ScheduleUpdateReq;
import com.ssafy.alpaca.api.request.ScheduleReq;
import com.ssafy.alpaca.api.response.ScheduleRes;
import com.ssafy.alpaca.api.response.ScheduleListRes;
import com.ssafy.alpaca.api.service.NotificationService;
import com.ssafy.alpaca.api.service.ScheduleService;
import com.ssafy.alpaca.api.service.StudyService;
import com.ssafy.alpaca.api.service.UserService;
import com.ssafy.alpaca.common.etc.BaseResponseBody;
import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.User;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final UserService userService;
    private final StudyService studyService;
    private final ScheduleService scheduleService;
    private final NotificationService notificationService;

    @ApiOperation(
            value = "스터디 일정 추가",
            notes = "스터디룸에서 일정을 추가한다."
    )
    @PostMapping()
    public ResponseEntity<BaseResponseBody> createSchedule(@RequestBody ScheduleReq scheduleReq)  {
        User user = userService.getCurrentUser();
        Study study = studyService.getStudyById(scheduleReq.getStudyId());
        Long scheduleId = scheduleService.createSchedule(user, study, scheduleReq);
        notificationService.createScheduleNotification(scheduleId);
        return ResponseEntity.ok(BaseResponseBody.of(200, scheduleId));
    }

    @ApiOperation(
            value = "오늘의 스터디 일정 조회",
            notes = "오늘 예정된 스터디의 문제들을 조회한다."
    )
    @GetMapping("/{id}/today")
    public ResponseEntity<ScheduleRes> getTodaySchedule(@PathVariable Long id, @RequestParam Integer offset) {
        User user = userService.getCurrentUser();
        Study study = studyService.getStudyById(id);
        return ResponseEntity.ok(scheduleService.getTodaySchedule(user, study, offset));
    }

    @ApiOperation(
            value = "스터디 일정 추가 수정",
            notes = "스터디 일정을 수정한다."
    )
    @ApiImplicitParam( name = "id", value = "수정할 일정의 id", dataTypeClass = Long.class )
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponseBody> updateSchedule(@PathVariable Long id, @RequestBody ScheduleUpdateReq scheduleUpdateReq) {
        User user = userService.getCurrentUser();
        scheduleService.updateSchedule(user, id, scheduleUpdateReq);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "스터디 일정 조회",
            notes = "스터디 일정을 조회한다."
    )
    @ApiImplicitParam( name = "id", value = "조회할 일정의 id", dataTypeClass = Long.class )
    @GetMapping("/{id}")
    public ResponseEntity<ScheduleRes> getSchedule(@PathVariable Long id) {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(scheduleService.getSchedule(user, id));
    }

    @ApiOperation(
            value = "스터디 일정 리스트 조회",
            notes = "특정 기간 (year, month, day)의 스터디 일정을 조회한다."
    )
    @ApiImplicitParams({
            @ApiImplicitParam( name = "id", value = "조회할 스터디의 id", dataTypeClass = Long.class ),
            @ApiImplicitParam( name = "year", value = "시작하는 해", dataTypeClass = Long.class ),
            @ApiImplicitParam( name = "month", value = "시작하는 달", dataTypeClass = Long.class ),
            @ApiImplicitParam( name = "day", value = "시작하는 날짜", dataTypeClass = Long.class ),
    })
    @GetMapping("/{id}/span")
    public ResponseEntity<List<ScheduleListRes>> getScheduleList(
            @PathVariable Long id, @RequestParam Integer year, @RequestParam Integer month, @RequestParam(required = false) Integer day) {
        User user = userService.getCurrentUser();
        Study study = studyService.getStudyById(id);
        return ResponseEntity.ok(scheduleService.getScheduleList(user, study, year, month, day));
    }

    @ApiOperation(
            value = "스터디 일정 삭제",
            notes = "스터디 일정을 삭제한다."
    )
    @ApiImplicitParam( name = "id", value = "삭제할 일정의 id", dataTypeClass = Long.class )
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponseBody> deleteSchedule(@PathVariable Long id)  {
        User user = userService.getCurrentUser();
        scheduleService.deleteSchedule(user, id);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

}
