package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordUpdateReq {
    @ApiModelProperty( name = "password", example = "testpassword1!")
    private String password;

    @ApiModelProperty( name = "changedPassword", example = "testpassword2!")
    private String changedPassword;

    @ApiModelProperty( name = "changedPasswordCheck", example = "testpassword2!")
    private String changedPasswordCheck;
}
