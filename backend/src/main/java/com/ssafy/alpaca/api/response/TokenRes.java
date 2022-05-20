package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.common.jwt.JwtHeaderEnums;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenRes {

    private String grantType;

    private String accessToken;

    private String refreshToken;

    public static TokenRes of(String accessToken, String refreshToken) {
        return TokenRes.builder()
                .grantType(JwtHeaderEnums.GRANT_TYPE.getValue())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
