package com.example.good_lodging_service.security.configuration;

import com.example.good_lodging_service.dto.request.Auth.IntrospectRequest;
import com.example.good_lodging_service.dto.response.Auth.IntrospectResponse;
import com.example.good_lodging_service.security.jwt.TokenProvider;
import com.example.good_lodging_service.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Objects;

@Slf4j
@Component
public class CustomJwtDecoder implements JwtDecoder {
    @Value("${jwt.signerKey}")
    private String signerKey;

    @Autowired
    private AuthenticationService authenticationService;
    private NimbusJwtDecoder nimbusJwtDecoder = null;
    @Autowired
    private TokenProvider tokenProvider;


    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            IntrospectResponse introspectResponse = authenticationService.introspect(new IntrospectRequest(token));
            if (introspectResponse == null || !introspectResponse.isValid()) {
                throw new JwtException("Invalid token");
            }
        } catch (ParseException | JOSEException e) {
            throw new JwtException("Error parsing JWT: " + e.getMessage(), e);
        }
        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(tokenProvider.getKey().getEncoded(), "HmacSHA512");
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec).macAlgorithm(MacAlgorithm.HS512).build();
        }
        return nimbusJwtDecoder.decode(token);
    }

}
