package com.example.good_lodging_service.constants;

import lombok.Getter;

@Getter
public enum Authorities {
    ADMIN_ADMIN(1,2,"ROLE_ADMIN"),
    CUSTOMER(2, 1, "ROLE_CUSTOMER");

    final int id;
    final int type;
    final String name;

    Authorities(int id, int type, String name) {
        this.id = id;
        this.type = type;
        this.name = name;
    }

    public static Authorities findAuthorityById(Integer id) {
        for (Authorities _clazz : Authorities.values()) {
            if (_clazz.getId() == id) {
                return _clazz;
            }
        }

        return null;
    }


}
