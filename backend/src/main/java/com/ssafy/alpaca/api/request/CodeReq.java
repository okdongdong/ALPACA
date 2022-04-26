package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeReq {

    @ApiModelProperty( name = "problemId", example = "626782ed301b13bd5ee4e782" )
    private String problemId;

    @ApiModelProperty( name = "code", example = "print(\"Hello world\")" )
    private String code;

}
