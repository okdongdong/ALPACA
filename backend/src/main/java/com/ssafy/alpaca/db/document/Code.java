package com.ssafy.alpaca.db.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "code")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Code {

    @Id
    private String id;

    private Long userId;

    private Long studyId;

    private Long scheduleId;

    private String problemId;

    private String code;

}
