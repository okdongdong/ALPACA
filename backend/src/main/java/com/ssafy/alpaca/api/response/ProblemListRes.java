package com.ssafy.alpaca.api.response;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemListRes {

    private Long id;

    private Long problemNumber;

    private String title;

    private Long level;

    private Boolean isSolved;

    private OffsetDateTime startedAt;

    private List<UserListRes> solvedMemberList;

}
