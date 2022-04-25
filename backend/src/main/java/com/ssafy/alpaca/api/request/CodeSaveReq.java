package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeSaveReq {

    @ApiModelProperty( name = "userId", example = "1" )
    private Long userId;

    @ApiModelProperty( name = "studyId", example = "2" )
    private Long studyId;

    @ApiModelProperty( name = "scheduleId", example = "3" )
    private Long scheduleId;

    @ApiModelProperty( name = "problemId", example = "625f5c065395d55f786b4138" )
    private String problemId;

    @ApiModelProperty( name = "code", example = "code" )
    private String code;
}
