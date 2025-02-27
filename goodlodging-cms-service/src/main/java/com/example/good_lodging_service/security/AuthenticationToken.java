package com.example.good_lodging_service.security;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;
@Getter
@Setter
@Builder
public class AuthenticationToken {
    private String token;
    private List<String> scopes;
    private List<String> roles;
    private Long userId;
    private String username;
}
