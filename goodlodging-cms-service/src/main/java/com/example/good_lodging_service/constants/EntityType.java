package com.example.good_lodging_service.constants;

import lombok.Getter;

@Getter
public enum EntityType {
    USER(1),ROOM(2),BOARDING_HOUSE(3);
    private final int value;
    EntityType(int value) {
        this.value = value;
    }
}
