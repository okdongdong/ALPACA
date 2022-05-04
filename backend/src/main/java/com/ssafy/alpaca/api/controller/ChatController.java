package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.ChatReq;
import com.ssafy.alpaca.api.response.ChatRes;
import com.ssafy.alpaca.api.service.StudyService;
import com.ssafy.alpaca.api.service.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatController {
    private final UserService userService;
    private final StudyService studyService;
    private final SimpMessagingTemplate template;

    @ApiOperation(
            value = "채팅기록 전송 및 저장",
            notes = "채팅 기록을 전송하고 저장한다."
    )
    // message를 받을 endpoint
    // "/pub/study/chat"로 받는다. Pathvariable이 되는지는 아직 모름
    @MessageMapping("/chat/study")
    // 처리를 마친 반환 값(message)를 반환할 곳
    public void createChat(ChatReq chatReq) {
        String username = userService.getCurrentUsername();
        ChatRes chatRes = studyService.saveChat(username, chatReq);
        template.convertAndSend("/sub/chat/study/"+chatReq.getStudyId(),chatRes);
    }
}
