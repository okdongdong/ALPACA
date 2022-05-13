package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.service.NotificationService;
import com.ssafy.alpaca.api.service.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


@RequiredArgsConstructor
@Slf4j
@RestController
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @ApiOperation(
            value="서버 연결",
            notes="sse와 연결한다."
    )
    @GetMapping(value = "/sub/notice", consumes = MediaType.ALL_VALUE)
    public SseEmitter subscribe(@RequestParam String token){
        return notificationService.subscribe(token);
    }
}
