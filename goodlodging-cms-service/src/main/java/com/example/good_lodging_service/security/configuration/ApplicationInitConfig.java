package com.example.good_lodging_service.security.configuration;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
    private static final String ADMIN_USERNAME="admin";
    private static final String ADMIN_PASSWORD="admin";
    PasswordEncoder passwordEncoder;
}
