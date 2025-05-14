package com.example.good_lodging_service.constants;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public enum PostType {
    NORMAL(1,"Phòng thường"),
    FIND_ROOM_MATE(2,"Tìm người ở ghép");
    private final int value;
    private final String name;
    PostType(int value, String name) {
        this.value = value;
        this.name = name;
    }
    public static List<PostType> getPostTypes(String name) {
        if (name == null || name.trim().isEmpty()) {
            return List.of(NORMAL, FIND_ROOM_MATE);
        }
        String lowerName = name.toLowerCase();
        List<PostType> matchedTypes = Arrays.stream(values())
                .filter(type -> type.getName().toLowerCase().contains(lowerName))
                .collect(Collectors.toList());
        return matchedTypes.isEmpty() ? List.of(NORMAL, FIND_ROOM_MATE) : matchedTypes;
    }
}
