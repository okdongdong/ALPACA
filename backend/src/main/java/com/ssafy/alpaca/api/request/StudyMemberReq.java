package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyMemberReq {

    @ApiModelProperty( name = "memberId", example = "1" )
    private Long memberId;

}
