package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatReq {

    @ApiModelProperty( name = "content", example = "내일까지 실버 374문제 풀어오세요!" )
    private String content;

}
