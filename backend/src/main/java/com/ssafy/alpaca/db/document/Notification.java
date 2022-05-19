package com.ssafy.alpaca.db.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.LocalDateTime;

@Document(collection = "notification")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    private String id;

    @Field(targetType = FieldType.INT64)
    private Long userId;

    private String roomMaker;

    private String roomMakerProfileImg;

    @Field(targetType = FieldType.INT64)
    private Long studyId;

    private String studyTitle;

    @Field(targetType = FieldType.INT64)
    private Long scheduleId;

    @Field(targetType = FieldType.DATE_TIME)
    private LocalDateTime scheduleStartedAt;

    @Field(targetType = FieldType.BOOLEAN)
    private Boolean isInvitation;

}
