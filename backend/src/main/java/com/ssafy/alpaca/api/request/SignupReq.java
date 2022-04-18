package com.ssafy.alpaca.api.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupReq {

    private String username;

    private String password;

    private String passwordCheck;

    private String nickname;

    private String bojId;

}
