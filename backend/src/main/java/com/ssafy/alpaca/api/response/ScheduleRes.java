package com.ssafy.alpaca.api.response;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleRes {

    private OffsetDateTime startedAt;

    private OffsetDateTime finishedAt;

    private List<ProblemListRes> problemListRes;

}
