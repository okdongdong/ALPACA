package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.ScheduleListReq;
import com.ssafy.alpaca.api.request.ScheduleUpdateReq;
import com.ssafy.alpaca.api.request.ScheduleReq;
import com.ssafy.alpaca.api.response.ScheduleRes;
import com.ssafy.alpaca.api.response.ScheduleListRes;
import com.ssafy.alpaca.api.service.ScheduleService;
import com.ssafy.alpaca.common.etc.BaseResponseBody;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @ApiOperation(
            value = "스터디 일정 추가",
            notes = "스터디룸에서 일정을 추가한다."
    )
    @PostMapping()
    public ResponseEntity<? extends BaseResponseBody> createSchedule(@RequestBody ScheduleReq scheduleReq) throws IllegalAccessException {
        return ResponseEntity.ok(BaseResponseBody.of(200, scheduleService.createSchedule(scheduleReq)));
    }

    @ApiOperation(
            value = "스터디 일정 추가 수정",
            notes = "스터디 일정을 수정한다."
    )
    @PutMapping("/{id}")
    public ResponseEntity<? extends BaseResponseBody> updateSchedule(@PathVariable String id, @RequestBody ScheduleUpdateReq scheduleUpdateReq) throws IllegalAccessException {
        scheduleService.updateSchedule(id, scheduleUpdateReq);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "스터디 일정 조회",
            notes = "스터디 일정을 조회한다."
    )
    @GetMapping("/{id}")
    public ResponseEntity<ScheduleRes> getSchedule(@PathVariable String id) throws IllegalAccessException {
        return ResponseEntity.ok(scheduleService.getSchedule(id));
    }

    @ApiOperation(
            value = "스터디 일정 리스트 조회",
            notes = "특정 기간 (year, month)의 스터디 일정을 조회한다."
    )
    @GetMapping("/monthly")
    public ResponseEntity<List<ScheduleListRes>> getScheduleMonthList(@RequestBody ScheduleListReq scheduleListReq) {
        return ResponseEntity.ok(scheduleService.getScheduleMonthList(scheduleListReq));
    }

    @ApiOperation(
            value = "스터디 일정 삭제",
            notes = "스터디 일정을 삭제한다."
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<? extends BaseResponseBody> deleteSchedule(@PathVariable String id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

}
