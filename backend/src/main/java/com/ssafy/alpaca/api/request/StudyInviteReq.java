package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyInviteReq {

    @ApiModelProperty( name = "inviteCode", example = "VTU0FCGS6H" )
    private String inviteCode;

}
