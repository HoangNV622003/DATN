package com.example.good_lodging_service.constants;

import lombok.Getter;

@Getter
public enum OTPConstant {
    OTP_EXPIRE_TIME_MINUTES(5);
    private final int value;
    OTPConstant(int value){
        this.value = value;
    }
}
