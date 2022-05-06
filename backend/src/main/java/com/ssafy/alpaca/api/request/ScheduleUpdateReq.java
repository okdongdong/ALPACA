package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleUpdateReq {

    @ApiModelProperty( name = "startedAt", example = "2022-04-12T10:32:44")
    private LocalDateTime startedAt;

    @ApiModelProperty( name = "finishedAt", example = "2022-04-15T12:32:44")
    private LocalDateTime finishedAt;

    @ApiModelProperty( name = "toSolveProblems", example = "[1001, 1002]")
    private List<Long> toSolveProblems;
}
