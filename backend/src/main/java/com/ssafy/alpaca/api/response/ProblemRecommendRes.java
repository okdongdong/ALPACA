package com.ssafy.alpaca.api.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemRecommendRes {

    private Long problemNumber;

    private String title;

    private Long level;

    private Long classLevel;

    private Boolean isSolved;

}
