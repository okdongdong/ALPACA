package com.ssafy.alpaca.db.document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "user")
@Getter
@Setter
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @JsonIgnore
    private String password;

    @Indexed(unique = true)
    private String nickname;

    private String info;

    private String bojId;

    private String theme;

    private String preferredLanguage;

    private Byte[] profileImg;

    @JsonIgnore
    @DBRef(lazy = true)
    private List<Problem> solvedProblems;

    @JsonIgnore
    @DBRef(lazy = true)
    private List<Study> studies;

}
