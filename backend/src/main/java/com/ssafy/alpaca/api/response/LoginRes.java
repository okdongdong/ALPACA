package com.ssafy.alpaca.api.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class LoginRes extends TokenRes{

    private String userId;

    private String username;

    private String nickname;

    private String info;

    private String profileImg;

    private String bojId;

    private String theme;

    private String preferredLanguage;

    private List<StudyListRes> studies;

    public static LoginRes of(TokenRes tokenRes, LoginRes loginRes) {
        return LoginRes.builder()
                .grantType(tokenRes.getGrantType())
                .accessToken(tokenRes.getAccessToken())
                .refreshToken(tokenRes.getRefreshToken())
                .userId(loginRes.getUserId())
                .username(loginRes.getUsername())
                .nickname(loginRes.getNickname())
                .info(loginRes.getInfo())
                .profileImg(loginRes.getProfileImg())
                .bojId(loginRes.getBojId())
                .theme(loginRes.getTheme())
                .preferredLanguage(loginRes.getPreferredLanguage())
                .studies(loginRes.getStudies())
                .build();
    }
}
