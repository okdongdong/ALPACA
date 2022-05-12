package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleUpdateReq {

    @ApiModelProperty( name = "startedAt", example = "2022-04-12T10:32:44Z")
    private OffsetDateTime startedAt;

    @ApiModelProperty( name = "finishedAt", example = "2022-04-15T12:32:44Z")
    private OffsetDateTime finishedAt;

    @ApiModelProperty( name = "toSolveProblems", example = "[1001, 1002]")
    private List<Long> toSolveProblems;
}
