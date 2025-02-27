package com.example.good_lodging_service.security.jwt;

import com.example.good_lodging_service.constants.Authorities;
import com.example.good_lodging_service.constants.TokenType;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import tech.jhipster.config.JHipsterProperties;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Getter
@Component
public class TokenProvider {

    private final Logger log = LoggerFactory.getLogger(TokenProvider.class);

    private static final String AUTHORITIES_KEY = "auth";
    private static final String CREATED_KEY = "created";
    private static final String USER_ID_KEY = "user_id";
    private static final String USERNAME_KEY = "username";

    private static final String TOKEN_TYPE = "token_type";
    private static final String INVALID_JWT_TOKEN = "Invalid JWT token.";

    private final Key key;

    private final JwtParser jwtParser;

    private final long tokenValidityInMilliseconds;

    private final long tokenValidityInMillisecondsForRememberMe;


    public TokenProvider(JHipsterProperties jHipsterProperties) {
        key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
        this.tokenValidityInMilliseconds = 1000 * jHipsterProperties.getSecurity().getAuthentication().getJwt().getTokenValidityInSeconds();
        this.tokenValidityInMillisecondsForRememberMe =
                1000 * jHipsterProperties.getSecurity().getAuthentication().getJwt().getTokenValidityInSecondsForRememberMe();
    }


    public String createTokenUser(Long userId, String username) {
        long now = (new Date()).getTime();
        Date expired = new Date(now + this.tokenValidityInMilliseconds);

        Map<String, Object> claims = new HashMap<>();
        claims.put(AUTHORITIES_KEY, Authorities.CUSTOMER.name());
        claims.put(CREATED_KEY, Instant.now().getEpochSecond());
        claims.put(USER_ID_KEY, userId);
        claims.put(USERNAME_KEY, username);
        claims.put(TOKEN_TYPE, TokenType.CUSTOMER.name());

        return Jwts
                .builder()
                .setClaims(claims)
                .setSubject(username)
                .setExpiration(expired)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String createTokenAdmin(Long userId, String username, String authorities) {
        long now = (new Date()).getTime();
        Date expired = new Date(now + this.tokenValidityInMilliseconds);

        Map<String, Object> claims = new HashMap<>();
        claims.put(AUTHORITIES_KEY, authorities);
        claims.put(CREATED_KEY, Instant.now().getEpochSecond());
        claims.put(USER_ID_KEY, userId);
        claims.put(TOKEN_TYPE, TokenType.ADMIN.name());

        return Jwts
                .builder()
                .setClaims(claims)
                .setSubject(username)
                .setExpiration(expired)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }


    public boolean validateToken(String authToken) {
        try {
            jwtParser.parseClaimsJws(authToken);
            return true;
        } catch (ExpiredJwtException e) {
            log.error("Token has expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (SignatureException e) {
            log.error("Invalid token signature: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("Token validation error: {}", e.getMessage());
        }

        return false;
    }

}
