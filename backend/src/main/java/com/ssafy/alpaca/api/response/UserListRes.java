package com.ssafy.alpaca.api.response;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserListRes {
    private String id;
    private String nickname;
    private String profileImg;
}
