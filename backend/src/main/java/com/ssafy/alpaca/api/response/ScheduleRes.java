package com.ssafy.alpaca.api.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleRes {

    private LocalDateTime startedAt;

    private LocalDateTime finishedAt;

    private List<ProblemListRes> problemListRes;

}
