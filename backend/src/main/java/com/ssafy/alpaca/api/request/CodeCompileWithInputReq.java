package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeCompileWithInputReq {

    @ApiModelProperty( name = "input", example = "" )
    private String input;

    @ApiModelProperty( name = "code", example = "print(list(map(int,input().split())))" )
    private String code;

    @ApiModelProperty( name = "language", example = "python3" )
    private String language;

}
