package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeReq {

    @ApiModelProperty( name = "problemNumber", example = "1000" )
    private Long problemNumber;

    @ApiModelProperty( name = "code", example = "print(\"Hello world\")" )
    private String code;

    @ApiModelProperty( name = "language", example = "python3" )
    private String language;

}
