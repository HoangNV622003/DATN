package com.example.good_lodging_service.security;

import com.example.good_lodging_service.constants.ConstantsAll;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;
@Component
public class SpringSecurityAuditorAware implements AuditorAware<Long> {

    @Override
    public Optional<Long> getCurrentAuditor() {
        return Optional.of(SecurityUtils.getCurrentUserIdLogin().orElse(ConstantsAll.SYSTEM_ID));
    }
}
