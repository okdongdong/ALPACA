package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeCompileWithInputReq extends CodeCompileReq{

    @ApiModelProperty( name = "input", example = "" )
    private String input;

}
