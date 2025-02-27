package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.dto.request.Auth.*;
import com.example.good_lodging_service.dto.request.Otp.OtpRequest;
import com.example.good_lodging_service.dto.response.Auth.AuthenticationResponse;
import com.example.good_lodging_service.dto.response.Auth.IntrospectResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.entity.InvalidatedToken;
import com.example.good_lodging_service.entity.User;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.repository.InvalidatedTokenRepository;
import com.example.good_lodging_service.repository.RoleRepository;
import com.example.good_lodging_service.repository.UserRepository;
import com.example.good_lodging_service.security.SecurityUtils;
import com.example.good_lodging_service.security.jwt.JWTServiceHandler;
import com.example.good_lodging_service.security.jwt.TokenProvider;
import com.example.good_lodging_service.validation.PasswordValidation;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    PasswordEncoder passwordEncoder;
    JWTServiceHandler jwtServiceHandler;
    TokenProvider tokenProvider;
    private final RoleRepository roleRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    Long REFRESHABLE_DURATION;

    @NonFinal
    @Value("${jwt.valid-duration}")
    Long VALID_DURATION;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        User user = userRepository.findByUsernameAndStatus(request.getUsername(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new AppException(ApiResponseCode.INVALID_PASSWORD);
        return AuthenticationResponse.builder()
                .accessToken(generateToken(user))
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws ParseException, JOSEException {
//        String token = request.getToken();
//        boolean isValid = true;
//        try {
//            verifyToken(token, false);
//        } catch (AppException e) {
//            isValid = false;
//        }
//        return IntrospectResponse.builder().valid(isValid).build();
        return IntrospectResponse.builder().valid(tokenProvider.validateToken(request.getToken())).build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signedJWT = verifyToken(request.getToken(), true);
            String jit = signedJWT.getJWTClaimsSet().getJWTID();
            Date expireTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            invalidatedTokenRepository.save(new InvalidatedToken(jit, expireTime));
        } catch (AppException e) {
            log.error(ApiResponseCode.INVALID_TOKEN.getMessage());
            throw new AppException(ApiResponseCode.INVALID_TOKEN);
        }
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken(), true);
        String jit = signedJWT.getJWTClaimsSet().getJWTID();
        Date expireTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken = new InvalidatedToken(jit, expireTime);
        invalidatedTokenRepository.save(invalidatedToken);

        String username = signedJWT.getJWTClaimsSet().getSubject();
        User user = userRepository.findByUsernameAndStatus(username, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        return AuthenticationResponse.builder().accessToken(generateToken(user)).build();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiration = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean verified = signedJWT.verify(verifier);
        if (!verified && expiration.after(new Date()))
            throw new AppException(ApiResponseCode.UNAUTHENTICATED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())){
            log.info("error: existing token in database");
            throw new AppException(ApiResponseCode.UNAUTHENTICATED);
        }
        System.out.println("userId:"+ SecurityUtils.getCurrentUserIdLogin());
        return signedJWT;
    }

    private String generateToken(User user) {
//        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
//
//        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
//                .subject(user.getUsername())
//                .issueTime(new Date())
//                .issuer("huce.edu.vn")
//                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
//                .jwtID(UUID.randomUUID().toString())
//                .claim("userId", user.getId())
//                .claim("scope", buildScope(user))
//                .build();
//        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
//        JWSObject jwsObject = new JWSObject(jwsHeader, payload);
//        try {
//            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
//            return jwsObject.serialize();
//        } catch (JOSEException e) {
//            log.error("Cannot create JWT object", e);
//            throw new RuntimeException(e);
//        }
        return tokenProvider.createTokenUser(user.getId(), user.getUsername());
    }

    private String buildScope(User user) {
        StringJoiner scope = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                scope.add("ROLE_" + role.getName());
            });
        }
        return scope.toString();
    }

    public CommonResponse changePassword(ChangeUserPasswordRequest request) {
        String currentPassword = request.getCurrentPassword();
        String newPassword = request.getNewPassword();
        if (currentPassword.equals(newPassword)) {
            return CommonResponse.builder()
                    .status(ApiResponseCode.PASSWORD_SAME_AS_OLD.getCode())
                    .result(ApiResponseCode.PASSWORD_SAME_AS_OLD.getMessage())
                    .build();
        }

        if (!PasswordValidation.isPasswordValid(newPassword)) {
            throw new AppException(ApiResponseCode.INVALID_PASSWORD);
        }

        Long userId = jwtServiceHandler.getUserIdRequesting();
        User user = userRepository.findByIdAndStatus(userId, CommonStatus.ACTIVE.getValue()).orElseThrow(() -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new AppException(ApiResponseCode.CURRENT_PASSWORD_INCORRECT);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return CommonResponse.builder().status(ApiResponseCode.SUCCESS.getCode()).result(ApiResponseCode.SUCCESS.getMessage()).build();
    }

    public CommonResponse forgotPassword(ChangeUserPasswordRequest request) {
        String newPassword = request.getNewPassword();
        String confirmNewPassword = request.getConfirmNewPassword();
        if (!confirmNewPassword.equals(newPassword)) {
            return CommonResponse.builder()
                    .status(ApiResponseCode.PASSWORD_CONFIRM_MISMATCH.getCode())
                    .result(ApiResponseCode.PASSWORD_CONFIRM_MISMATCH.getMessage())
                    .build();
        }

        if (!PasswordValidation.isPasswordValid(newPassword)) {
            throw new AppException(ApiResponseCode.INVALID_PASSWORD);
        }
        Long userId = jwtServiceHandler.getUserIdRequesting();
        User user = userRepository.findByIdAndStatus(userId, CommonStatus.ACTIVE.getValue()).orElseThrow(() -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return CommonResponse.builder().status(ApiResponseCode.SUCCESS.getCode()).result(ApiResponseCode.SUCCESS.getMessage()).build();
    }

}
