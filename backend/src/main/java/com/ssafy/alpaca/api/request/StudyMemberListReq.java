package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyMemberListReq {

    @ApiModelProperty( name = "memberIdList", example = "[1,2,3]" )
    private List<Long> memberIdList;
}
