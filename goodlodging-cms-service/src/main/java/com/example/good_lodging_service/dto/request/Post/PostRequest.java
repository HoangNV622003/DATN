package com.example.good_lodging_service.dto.request.Post;

import com.example.good_lodging_service.dto.request.Image.ImageRequest;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostRequest {
    String title;
    String imageUrl;
    Float area;
    Float roomRent;
    String address;
    Long roomId;
    Long userId;
    Long boardingHouseId;

}
