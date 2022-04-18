package com.ssafy.alpaca.db.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Document(collection = "study")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Study {

    @Id
    private String id;

    private String title;

    private String info;

    @Indexed(unique = true)
    private String inviteCode;

    private String sessionId;

    @DBRef(lazy = true)
    private User roomMaker;

    @DBRef(lazy = true)
    private List<User> members;

    @DBRef(lazy = true)
    private List<Schedule> schedules;

}
