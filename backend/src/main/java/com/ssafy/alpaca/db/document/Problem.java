package com.ssafy.alpaca.db.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.List;

@Document(collection = "problem")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Problem {

    @Id
    private String id;

    @Field(targetType = FieldType.INT64)
    @Indexed(unique = true)
    private Long problemNumber;

    private String title;

    @Field(targetType = FieldType.INT32)
    private Integer level;

    @Field(targetType = FieldType.ARRAY)
    private List<String> inputs;

    @Field(targetType = FieldType.ARRAY)
    private List<String> outputs;

}
