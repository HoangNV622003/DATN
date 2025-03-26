package com.example.good_lodging_service.dto.request.FavoritePost;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FavoritePostRequest {
    Long postId;
    Long userId;
}
