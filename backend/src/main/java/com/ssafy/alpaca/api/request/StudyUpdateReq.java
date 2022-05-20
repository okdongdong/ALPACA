package com.ssafy.alpaca.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyUpdateReq {

    @ApiModelProperty( name = "title", example = "Algorithm Study 1" )
    private String title;

    @ApiModelProperty( name = "info",
            example = "Find the latest breaking news and information on the weather, entertainment, and more." )
    private String info;
}
