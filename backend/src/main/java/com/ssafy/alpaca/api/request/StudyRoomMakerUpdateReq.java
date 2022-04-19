package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyRoomMakerUpdateReq {

    @ApiModelProperty( name = "studyId" )
    private String studyId;

    @ApiModelProperty( name = "roomMakerId" )
    private String inheritorId;

}
