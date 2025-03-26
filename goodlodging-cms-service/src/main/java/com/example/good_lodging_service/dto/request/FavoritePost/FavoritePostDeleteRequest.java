package com.example.good_lodging_service.dto.request.FavoritePost;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FavoritePostDeleteRequest {
    Long userId;
    List<Long> postIds;
}
