package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupReq {

    @ApiModelProperty( name = "username", example = "testuser1" )
    private String username;

    @ApiModelProperty( name = "password", example = "testpassword1!")
    private String password;

    @ApiModelProperty( name = "passwordCheck", example = "testpassword1!")
    private String passwordCheck;

    @ApiModelProperty( name = "nickname", example = "알파카")
    private String nickname;

    @ApiModelProperty( name = "bojId" )
    private String bojId;

}
