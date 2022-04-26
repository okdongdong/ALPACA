package com.ssafy.alpaca.api.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeSaveRes {
    private List<String> outputList;
    private List<String> answerList;
}
