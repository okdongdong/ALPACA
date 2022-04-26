package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeUpdateReq {

    @ApiModelProperty( name = "userId", example = "1" )
    private Long userId;

    @ApiModelProperty( name = "problemId", example = "625f5c065395d55f786b4138" )
    private String problemId;

    @ApiModelProperty( name = "code", example = "code" )
    private String code;
}
