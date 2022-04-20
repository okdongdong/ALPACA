package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.document.Problem;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleInfoRes {
    private LocalDateTime startedAt;
    private List<Problem> toSolveProblems;
}
