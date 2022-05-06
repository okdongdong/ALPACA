package com.ssafy.alpaca.db.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Document(collection = "chat")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Chat {

    @Id
    private String id;

    @Field(targetType = FieldType.INT64)
    private Long userId;

    @Field(targetType = FieldType.INT64)
    private Long studyId;

    @Builder.Default
    @Field(targetType = FieldType.DATE_TIME)
    private LocalDateTime timeStamp = LocalDateTime.now();

    @NotBlank
    private String content;

}
