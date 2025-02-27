package com.example.good_lodging_service.exception;

import com.example.good_lodging_service.constants.ApiResponseCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppException extends RuntimeException {

    private final ApiResponseCode errorCode;

    public AppException(ApiResponseCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
