package com.example.good_lodging_service.security;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import com.example.good_lodging_service.constants.AuthoritiesConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

@Slf4j
public final class SecurityUtils {
    private SecurityUtils() {
    }

    public static Optional<Long> getCurrentUserIdLogin() {
        Long userId= (Long) getClaim("userId");

        return userId == null ? Optional.empty() : Optional.of(userId);
    }

    public static Map<String, Object> getClaimsFromSecurityContext() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuthToken) {
            Jwt jwt = jwtAuthToken.getToken();
            return jwt.getClaims();
        }
        return Map.of();
    }

    public static Object getClaim(String claimName) {
        Map<String, Object> claims = getClaimsFromSecurityContext();
        return claims.get(claimName);
    }
}
