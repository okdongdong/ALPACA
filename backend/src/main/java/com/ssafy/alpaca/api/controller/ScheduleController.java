package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.ScheduleReq;
import com.ssafy.alpaca.api.service.ScheduleService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @ApiOperation(
            value = "스터디 일정 추가",
            notes = "스터디룸에서 일정을 추가한다."
    )
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createSchedule(@RequestBody ScheduleReq scheduleReq) throws IllegalAccessException{
        return ResponseEntity.ok(scheduleService.createSchedule(scheduleReq));
    }
}
