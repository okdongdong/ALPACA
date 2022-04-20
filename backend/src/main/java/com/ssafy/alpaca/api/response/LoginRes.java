package com.ssafy.alpaca.api.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class LoginRes extends TokenRes{

    private String userId;
    private String nickname;
    private String profileImg;



    public static LoginRes of(TokenRes tokenRes, MyInfoRes myInfoRes) {
        return LoginRes.builder()
                .grantType(tokenRes.getGrantType())
                .accessToken(tokenRes.getAccessToken())
                .refreshToken(tokenRes.getRefreshToken())
                .userId(myInfoRes.getUserId())
                .nickname(myInfoRes.getNickname())
                .profileImg(myInfoRes.getProfileImg())
                .build();
    }
}
