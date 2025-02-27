package com.example.good_lodging_service.constants;

import lombok.Getter;

@Getter
public enum SystemEmail {
    ADMIN_EMAIL("hoangnv7979@gmail.com"),
    ;

    private final String email;

    SystemEmail(String email) {
        this.email = email;
    }
}
