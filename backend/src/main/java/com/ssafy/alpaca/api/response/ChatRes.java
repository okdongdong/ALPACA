package com.ssafy.alpaca.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ChatRes {
    @ApiModelProperty( name = "nickname", example = "곤듀" )
    private String nickname;

    @ApiModelProperty( name = "content", example = "내일까지 실버 374문제 풀어오세요!" )
    private String content;

    @ApiModelProperty( name = "timeStamp", example = "2022-04-12T10:32:44" )
    @Builder.Default
    private LocalDateTime timeStamp = LocalDateTime.now();
}
