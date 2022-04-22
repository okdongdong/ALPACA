package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyMemberReq {

    @ApiModelProperty( name = "memberId", example = "testuser2" )
    private Long memberId;

}
