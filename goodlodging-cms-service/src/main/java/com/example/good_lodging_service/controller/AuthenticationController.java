package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.ApiResponse;
import com.example.good_lodging_service.dto.request.Auth.*;
import com.example.good_lodging_service.dto.response.Auth.AuthenticationResponse;
import com.example.good_lodging_service.dto.response.Auth.IntrospectResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/token")
    public ApiResponse<AuthenticationResponse> token(@RequestBody AuthenticationRequest authenticationRequest) {
        return ApiResponse.<AuthenticationResponse>builder().result(authenticationService.authenticate(authenticationRequest)).build();
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest requestDTO) throws ParseException, JOSEException {
        System.out.println("hello");
        return ApiResponse.<IntrospectResponse>builder().result(authenticationService.introspect(requestDTO)).build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody LogoutRequest requestDTO) throws ParseException, JOSEException {
        authenticationService.logout(requestDTO);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthenticationResponse> refresh(@RequestBody RefreshRequest refreshRequest) throws ParseException, JOSEException {
        return ApiResponse.<AuthenticationResponse>builder().result(authenticationService.refreshToken(refreshRequest)).build();
    }

    @PostMapping("/change-password")
    public ApiResponse<CommonResponse> changeUserPassword(@RequestBody ChangeUserPasswordRequest changeUserPasswordRequest) {
        return ApiResponse.<CommonResponse>builder().result(authenticationService.changePassword(changeUserPasswordRequest)).build();
    }
}
