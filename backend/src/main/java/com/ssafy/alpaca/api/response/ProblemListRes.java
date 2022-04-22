package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.document.Problem;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemListRes {

    private String id;

    private Integer number;

    private String title;

    private Integer level;

    public static List<ProblemListRes> of (List<Problem> list){
        return list.stream().map(problem -> ProblemListRes.builder()
                        .id(problem.getId())
                        .number(problem.getNumber())
                        .title(problem.getTitle())
                        .level(problem.getLevel())
                        .build())
                .collect(Collectors.toList());
    }
}
