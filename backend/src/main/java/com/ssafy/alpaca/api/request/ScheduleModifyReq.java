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
public class ScheduleModifyReq {

    @ApiModelProperty( name = "startedAt", example = "2019-11-12T12:32:44")
    private LocalDateTime startedAt;

    @ApiModelProperty( name = "toSolveProblems", example = "['625f62ad9319670330d4993e']")
    private List<String> toSolveProblems;
}
