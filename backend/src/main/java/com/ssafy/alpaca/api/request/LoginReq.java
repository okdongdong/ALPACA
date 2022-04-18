package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginReq {

    @ApiModelProperty( name = "username", example = "testuser1" )
    private String username;

    @ApiModelProperty( name = "password", example = "testpassword1!")
    private String password;
}
