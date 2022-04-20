package com.ssafy.alpaca.common.etc;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseResponseBody {

    @ApiModelProperty(name="응답 메시지", example = "OK")
    private String message = null;

    @ApiModelProperty(name="응답 코드", example = "200")
    private Integer statusCode = null;

    public BaseResponseBody() {}

    public BaseResponseBody(Integer statusCode){
        this.statusCode = statusCode;
    }

    public BaseResponseBody(Integer statusCode, String message){
        this.statusCode = statusCode;
        this.message = message;
    }

    public static BaseResponseBody of(Integer statusCode, String message) {
        BaseResponseBody body = new BaseResponseBody();
        body.message = message;
        body.statusCode = statusCode;
        return body;
    }
}