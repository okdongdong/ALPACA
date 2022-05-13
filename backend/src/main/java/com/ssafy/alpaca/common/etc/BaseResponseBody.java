package com.ssafy.alpaca.common.etc;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BaseResponseBody {

    @ApiModelProperty(name="응답 메시지", example = "OK")
    private String message = null;

    @ApiModelProperty(name="응답 코드", example = "200")
    private Integer statusCode = null;


    public static BaseResponseBody of(Integer statusCode, String message) {
        BaseResponseBody body = new BaseResponseBody();
        body.message = message;
        body.statusCode = statusCode;
        return body;
    }

    public static BaseResponseBody of(Integer statusCode, Long message) {
        BaseResponseBody body = new BaseResponseBody();
        body.message = String.valueOf(message);
        body.statusCode = statusCode;
        return body;
    }
}