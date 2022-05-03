package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Builder
@AllArgsConstructor
public class ChatReq {

//    @ApiModelProperty( name = "userId", example = "1" )
//    private String userId;

    @ApiModelProperty( name = "studyId", example = "1" )
    private Long studyId;

    @ApiModelProperty( name = "content", example = "내일까지 실버 374문제 풀어오세요!" )
    private String content;

}
