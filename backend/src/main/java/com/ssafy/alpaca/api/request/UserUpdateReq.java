package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateReq {

    @ApiModelProperty( name = "nickname", example = "라마" )
    private String nickname;

    @ApiModelProperty( name = "info", example = "King of Algorithm" )
    private String info;

    @ApiModelProperty( name = "theme", example = "dark" )
    private String theme;

    @ApiModelProperty( name = "preferredLanguage", example = "java" )
    private String preferredLanguage;

}
