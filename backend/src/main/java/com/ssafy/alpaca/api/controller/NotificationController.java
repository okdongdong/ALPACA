package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.NotificationReq;
import com.ssafy.alpaca.api.response.NotificationRes;
import com.ssafy.alpaca.api.service.NotificationService;
import com.ssafy.alpaca.api.service.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;


@RequiredArgsConstructor
@RequestMapping("notification")
@RestController
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @ApiOperation(
            value = "알람 받기",
            notes = "처리되지 않은 모든 알람을 가져온다."
    )
    @GetMapping()
    public ResponseEntity<List<NotificationRes>> getNotification() {
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(notificationService.getNotification(username));
    }

    @ApiOperation(
            value = "알람 처리하기",
            notes = "특정 알람을 삭제하여 처리한다."
    )
    @PostMapping()
    public void deleteNotification(@RequestBody NotificationReq notificationReq) {
        String username = userService.getCurrentUsername();
        notificationService.deleteNotification(username, notificationReq);
    }
}
