package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.document.Problem;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemRecommendRes {

    private Problem problem;

    private Boolean isSolved;

}
