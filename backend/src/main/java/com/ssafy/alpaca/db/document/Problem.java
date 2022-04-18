package com.ssafy.alpaca.db.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

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

    @Indexed(unique = true)
    private Integer number;

    private String title;

    private Integer level;

    @DBRef(lazy = true)
    private List<String> inputs;

    @DBRef(lazy = true)
    private List<String> outputs;

}
