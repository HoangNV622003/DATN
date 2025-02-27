package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.constants.OTPConstant;
import com.example.good_lodging_service.dto.request.Otp.OtpRequest;
import com.example.good_lodging_service.dto.request.Otp.ValidateOtpRequest;
import com.example.good_lodging_service.dto.response.Otp.OtpResponse;
import com.example.good_lodging_service.dto.response.Otp.ValidateOtpResponse;
import com.example.good_lodging_service.service.PushNotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
    PushNotificationService pushNotificationService;

    @PostMapping("/otp/send")
    ResponseEntity<OtpResponse> sendOtp(@RequestBody OtpRequest request) {
        pushNotificationService.sendOtp(request);
        Instant expireTime = Instant.now().plusSeconds(OTPConstant.OTP_EXPIRE_TIME_MINUTES.getValue());
        return ResponseEntity.ok(OtpResponse.builder().expiryTime(expireTime).build());
    }

    @PostMapping("/otp/resend")
    ResponseEntity<OtpResponse> resendOtp(@RequestBody OtpRequest request) {
        pushNotificationService.resendOtp(request);
        Instant expireTime = Instant.now().plusSeconds(OTPConstant.OTP_EXPIRE_TIME_MINUTES.getValue());
        return ResponseEntity.ok(OtpResponse.builder().expiryTime(expireTime).build());
    }

    @PostMapping("/otp/verify")
    ResponseEntity<ValidateOtpResponse> validateOtp(@RequestBody ValidateOtpRequest request) {
        return ResponseEntity.ok(ValidateOtpResponse.builder().isValid(pushNotificationService.validateOtp(request)).build());
    }

}
