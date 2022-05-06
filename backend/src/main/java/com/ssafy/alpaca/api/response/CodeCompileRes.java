package com.ssafy.alpaca.api.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeCompileRes {

    private Long result;

    private String output;

    private String memory;

    private String runtime;

    private String answer;

    private Boolean isCorrect;

}
