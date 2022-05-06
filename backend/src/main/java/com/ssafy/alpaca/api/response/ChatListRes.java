package com.ssafy.alpaca.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatListRes {
    @ApiModelProperty( name = "userId", example = "1" )
    private Long userId;

    @ApiModelProperty( name = "content", example = "내일까지 실버 374문제 풀어오세요!" )
    private String content;

    @ApiModelProperty( name = "timeStamp", example = "2022-04-12T10:32:44" )
    private LocalDateTime timeStamp;
}
