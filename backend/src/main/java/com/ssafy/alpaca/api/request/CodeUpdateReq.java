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

    @ApiModelProperty( name = "studyId", example = "2" )
    private Long studyId;

    @ApiModelProperty( name = "scheduleId", example = "3" )
    private Long scheduleId;

    @ApiModelProperty( name = "problemId", example = "626782ed301b13bd5ee4e782" )
    private String problemId;

    @ApiModelProperty( name = "code", example = "print(list(map(int,input().split())))" )
    private String code;

    @ApiModelProperty( name = "language", example = "python3" )
    private String language;

    @ApiModelProperty( name = "versionIndex", example = "4" )
    private String versionIndex;

}
