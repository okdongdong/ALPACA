package com.ssafy.alpaca.api.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemRes {

    private Long problemNumber;

    private String title;

    private Long level;

    private Long classLevel;

    private List<String> inputs;

    private List<String> outputs;

    private Boolean isSolved;

}
