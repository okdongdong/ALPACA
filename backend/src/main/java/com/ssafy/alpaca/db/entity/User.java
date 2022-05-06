package com.ssafy.alpaca.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Entity
@Table(name = "user")
@Getter
@Setter
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
//    @Pattern(regexp = "")
    @Size(min = 6, max = 20)
    @Column(unique = true)
    private String username;

    @NotBlank
    @JsonIgnore
    private String password;

    @NotBlank
    @Size(min = 2, max = 20)
    @Column(unique = true)
    private String nickname;

    private String info;

    @NotBlank
    @Column(name = "boj_id", unique = true)
    private String bojId;

    @Column(name = "class_level")
    private Long classLevel;

    @NotBlank
    @Column(name = "class_decoration")
    private String classDecoration;

    @Builder.Default
    private String theme = "basic";

    @Builder.Default
    @Column(name = "preferred_language")
    private String preferredLanguage = "python3";

    @Column(name = "profile_img")
    @Lob
    private Byte[] profileImg;

}
