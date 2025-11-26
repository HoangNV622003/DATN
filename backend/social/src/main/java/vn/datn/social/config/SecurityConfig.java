package vn.datn.social.config;

import vn.datn.social.constant.AuthoritiesConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import tech.jhipster.config.JHipsterProperties;
import vn.datn.social.security.jwt.CustomJwtAccessDeniedHandler;
import vn.datn.social.security.jwt.CustomJwtAuthenticationConverter;
import vn.datn.social.security.jwt.CustomJwtAuthenticationEntryPoint;
import vn.datn.social.security.jwt.CustomJwtDecoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JHipsterProperties jHipsterProperties;
    private final CustomJwtAuthenticationConverter customJwtAuthenticationConverter;
    public SecurityConfig(CustomJwtAuthenticationConverter converter, JHipsterProperties jHipsterProperties) {
        this.customJwtAuthenticationConverter = converter;
        this.jHipsterProperties = jHipsterProperties;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CustomJwtDecoder customJwtDecoder) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(new CustomJwtAuthenticationEntryPoint())
                        .accessDeniedHandler(new CustomJwtAccessDeniedHandler())
                )
                .headers(header -> header
                        .addHeaderWriter(new StaticHeadersWriter("Content-Security-Policy",
                                jHipsterProperties.getSecurity().getContentSecurityPolicy()))
                        .referrerPolicy(referrer -> referrer
                                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                        .permissionsPolicyHeader(permissions -> permissions
                                .policy("camera=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), sync-xhr=()"))
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                )
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/authenticate").permitAll()
                        .requestMatchers("/api/admin/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
                        .requestMatchers("/api/users").permitAll()
                        .requestMatchers("/api/**").authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(customJwtDecoder)//xác thực token
                                .jwtAuthenticationConverter(customJwtAuthenticationConverter)// chuyển đổi token hợp lệ thành đối tượng Authentication
                        )
                );
        return http.build();
    }

}