package com.ssafy.alpaca.api.response;


import com.ssafy.alpaca.db.document.Study;
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

    private List<Study> studies;

    public static LoginRes of(TokenRes tokenRes, MyInfoRes myInfoRes) {
        return LoginRes.builder()
                .grantType(tokenRes.getGrantType())
                .accessToken(tokenRes.getAccessToken())
                .refreshToken(tokenRes.getRefreshToken())
                .userId(myInfoRes.getUserId())
                .username(myInfoRes.getUsername())
                .nickname(myInfoRes.getNickname())
                .info(myInfoRes.getInfo())
                .profileImg(myInfoRes.getProfileImg())
                .bojId(myInfoRes.getBojId())
                .theme(myInfoRes.getTheme())
                .preferredLanguage(myInfoRes.getPreferredLanguage())
                .studies(myInfoRes.getStudies())
                .build();
    }
}
