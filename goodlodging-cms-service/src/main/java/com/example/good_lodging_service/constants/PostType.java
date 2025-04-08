package com.example.good_lodging_service.constants;

import lombok.Getter;

@Getter
public enum PostType {
    NORMAL(1),FIND_ROOM_MATE(2);
    private final int value;
    PostType(int value) {
        this.value = value;
    }
}
