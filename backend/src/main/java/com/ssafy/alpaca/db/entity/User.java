package com.ssafy.alpaca.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    @JsonIgnore
    private String password;

    @Column(unique = true)
    private String nickname;

    private String info;

    @Column(name = "boj_id", unique = true)
    private String bojId;

    @Builder.Default
    private String theme = "basic";

    @Builder.Default
    @Column(name = "preferred_language")
    private String preferredLanguage = "python3";

    @Column(name = "profile_img")
    @Lob
    private Byte[] profileImg;

}
