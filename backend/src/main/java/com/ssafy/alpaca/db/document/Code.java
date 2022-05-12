package com.ssafy.alpaca.db.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Document(collection = "code")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Code {

    @Id
    private String id;

    @Field(targetType = FieldType.INT64)
    private Long userId;

    @Field(targetType = FieldType.INT64)
    private Long problemNumber;

    private String language;

    @Builder.Default
    @Field(targetType = FieldType.DATE_TIME)
    private OffsetDateTime submittedAt = OffsetDateTime.now();

    private String submittedCode;

}
