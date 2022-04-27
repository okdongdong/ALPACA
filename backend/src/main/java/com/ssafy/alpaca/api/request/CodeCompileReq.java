package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeCompileReq {

    @ApiModelProperty( name = "problemId", example = "626782ed301b13bd5ee4e782" )
    private String problemId;

    @ApiModelProperty( name = "code", example = "print(list(map(int,input().split())))" )
    private String code;

    @ApiModelProperty( name = "language", example = "python3" )
    private String language;

}
