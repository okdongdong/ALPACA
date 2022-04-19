package com.ssafy.alpaca.api.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyInfoRes {
    private String userId;
    private String username;
    private String nickname;
    private String profileImg;
}
