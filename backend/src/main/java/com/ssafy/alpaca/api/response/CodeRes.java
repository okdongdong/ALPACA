package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.document.Code;
import com.ssafy.alpaca.db.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class CodeRes {

    private String nickname;

    private String profileImg;

    private Long problemNumber;

    private Long level;

    private List<CodeList> codeSet;

    @Builder
    public static class CodeList {

        private String language;

        private LocalDateTime submittedAt;

        private String submittedCode;

        public static List<CodeList> of (List<Code> list) {
            return list.stream().map(
                    code -> CodeList.builder()
                            .language(code.getLanguage())
                            .submittedAt(code.getSubmittedAt())
                            .submittedCode(code.getSubmittedCode())
                            .build()
            ).collect(Collectors.toList());
        }
    }
}
