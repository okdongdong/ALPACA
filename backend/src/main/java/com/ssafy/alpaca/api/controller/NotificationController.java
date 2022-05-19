package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.NotificationReq;
import com.ssafy.alpaca.api.service.NotificationService;
import com.ssafy.alpaca.api.service.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


@RequiredArgsConstructor
@RequestMapping("notification")
@RestController
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

//    @ApiOperation(
//            value="서버 연결",
//            notes="sse와 연결한다."
//    )
//    @GetMapping(value = "/sub/notice", consumes = MediaType.ALL_VALUE)
//    public SseEmitter subscribe(@RequestParam String token){
//        return notificationService.subscribe(token);
//    }

    @ApiOperation(
            value = "알람 받기",
            notes = "처리되지 않은 모든 알람을 가져온다."
    )
    @GetMapping()
    public void getNotification() {
        String username = userService.getCurrentUsername();
        notificationService.getNotification(username);
    }

    @ApiOperation(
            value = "알람 처리하기",
            notes = "특정 알람에 대한 수락/거절 요청을 처리한다."
    )
    @PostMapping()
    public void deleteNotification(@RequestBody NotificationReq notificationReq) {
        String username = userService.getCurrentUsername();
        notificationService.deleteNotification(username, notificationReq);
    }
}
