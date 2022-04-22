package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.entity.SolvedProblem;
import com.ssafy.alpaca.db.entity.User;
import lombok.*;

import java.time.LocalDateTime;
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

    private LocalDateTime startedAt;

    private List<User> solvedMemberList;

    public static List<User> of (List<SolvedProblem> list) {
        return list.stream().map(SolvedProblem::getUser).collect(Collectors.toList());
    }
}
