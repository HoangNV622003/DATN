package com.example.good_lodging_service.security.jwt;

import com.example.good_lodging_service.security.AuthenticationToken;
import com.example.good_lodging_service.security.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class JWTServiceHandler {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public JWTServiceHandler() {
    }

    private boolean hasScope(String scopeApprove) {
        AuthenticationToken authentication = (AuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        this.logger.info("HAS SCOPE: {}", authentication.getScopes().contains(scopeApprove));
        return authentication.getScopes().contains(scopeApprove);
    }

    public Long getUserIdRequesting() {
        try {
            return SecurityUtils.getCurrentUserIdLogin().orElse((Long) null);
        } catch (Exception var2) {
            return null;
        }
    }
}
