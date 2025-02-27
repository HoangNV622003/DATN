package com.example.good_lodging_service.dto.response.Otp;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
@Getter
@Setter
@Builder
public class OtpResponse {
    Instant expiryTime;
}
