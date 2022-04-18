package com.ssafy.alpaca.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.DuplicateFormatFlagsException;
import java.util.NoSuchElementException;

@Slf4j
@RestControllerAdvice(basePackages = "com.ssafy.alpaca.api")
public class GlobalExceptionControllerAdvice {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalAccessException.class)
    public ErrorResult illegalAccessExHandler(IllegalAccessException e) {
        return new ErrorResult(e.getMessage());
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(IllegalArgumentException.class)
    public ErrorResult illegalArgExHandler(IllegalArgumentException e) {
        return new ErrorResult(e.getMessage());
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NoSuchElementException.class)
    public ErrorResult noSuchExHandler(NoSuchElementException e) {
        return new ErrorResult(e.getMessage());
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(DuplicateFormatFlagsException.class)
    public ErrorResult duplicateFormatFlagsException(DuplicateFormatFlagsException e) {
        return new ErrorResult(e.getMessage());
    }

}
