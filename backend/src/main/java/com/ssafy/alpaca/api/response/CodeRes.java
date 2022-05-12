package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.document.Code;
import com.ssafy.alpaca.db.entity.User;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeRes {

    private String nickname;

    private String profileImg;

    private Long problemNumber;

    private String title;

    private Long level;

    private List<CodeList> codeSet;

    @Getter
    @Builder
    public static class CodeList {

        private String language;

        private OffsetDateTime submittedAt;

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
