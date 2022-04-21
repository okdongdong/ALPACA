package com.ssafy.alpaca.api.request;

import com.ssafy.alpaca.db.document.Problem;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleReq {

    @ApiModelProperty( name = "studyId", example = "study1" )
    private String studyId;

    @ApiModelProperty( name = "startedAt", example = "2022-04-12T12:32:44")
    private LocalDateTime startedAt;

    @ApiModelProperty( name = "finishedAt", example = "2022-04-15T12:32:44")
    private LocalDateTime finishedAt;

    @ApiModelProperty( name = "toSolveProblems", example = "['625f62ad9319670330d4993e']")
    private List<String> toSolveProblems;

}
