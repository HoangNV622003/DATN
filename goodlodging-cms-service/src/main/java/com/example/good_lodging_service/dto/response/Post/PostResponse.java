package com.example.good_lodging_service.dto.response.Post;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    Long id;
    String title;
    String imageUrl;
    Float maxArea;
    Float minArea;
    Float minRent;
    Float maxRent;
    Float electricityPrice;
    Float waterPrice;
    Float otherPrice;


    String address;
    Long boardingHouseId;
    Long userId;
}
