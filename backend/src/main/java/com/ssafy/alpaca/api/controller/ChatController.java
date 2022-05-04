package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.request.ChatReq;
import com.ssafy.alpaca.api.response.ChatListRes;
import com.ssafy.alpaca.api.response.ChatRes;
import com.ssafy.alpaca.api.service.StudyService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatController {

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

        ChatRes chatRes = studyService.saveChat(chatReq);
        template.convertAndSend("/sub/chat/study/"+chatReq.getStudyId(),chatRes);
    }

    @ApiOperation(
            value = "채팅 내용 조회",
            notes = "pageable에 해당하는 채팅을 20개단위로 조회한다."
    )
    @GetMapping("/chat/study/{id}")
    public ResponseEntity<Slice<ChatListRes>> getChatListByStudy(@PathVariable Long id, @RequestParam String offsetId, @PageableDefault(size = 20, sort = "timeStamp", direction = Sort.Direction.DESC) Pageable pageable){
        return ResponseEntity.ok(studyService.getChatListByStudy(id,offsetId, pageable));
    }

}
