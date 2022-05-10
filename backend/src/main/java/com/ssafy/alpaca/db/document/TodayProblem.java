package com.ssafy.alpaca.db.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "today_problem")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TodayProblem {

    @Id
    private String id;

    @Field(targetType = FieldType.INT64)
    private Long userId;

    @Field(targetType = FieldType.ARRAY)
    private List<Problem> problems;

    @Field(targetType = FieldType.DATE_TIME)
    private LocalDate date;

}
