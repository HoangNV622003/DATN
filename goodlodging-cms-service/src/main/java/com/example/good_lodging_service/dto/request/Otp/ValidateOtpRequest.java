package com.example.good_lodging_service.dto.request.Otp;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;


@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ValidateOtpRequest {
    String email;
    String otp;
}
