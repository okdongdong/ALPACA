package com.ssafy.alpaca.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class JwtFilterException extends RuntimeException{
    private final String message;
}
