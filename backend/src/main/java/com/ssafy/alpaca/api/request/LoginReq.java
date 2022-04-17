package com.ssafy.alpaca.api.request;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginReq {

    private String username;

    private String password;
}
