package com.ssafy.alpaca.api.response;


import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRes {

    private Long userId;

    private String username;

    private String nickname;

    private String info;

    private String profileImg;

    private String bojId;

    private String theme;

    private String preferredLanguage;

    private String grantType;

    private String accessToken;

    private String refreshToken;

}
