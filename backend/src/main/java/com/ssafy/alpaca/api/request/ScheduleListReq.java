package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleListReq {

    @ApiModelProperty( name = "studyId", example = "135aetgw46t35y" )
    private String studyId;

    @ApiModelProperty( name = "year", example = "2022")
    private Integer year;

    @ApiModelProperty( name = "month", example = "4")
    private Integer month;
}
