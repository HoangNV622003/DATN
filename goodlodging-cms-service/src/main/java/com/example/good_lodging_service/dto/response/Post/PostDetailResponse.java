package com.example.good_lodging_service.dto.response.Post;

import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.Profile.ProfileResponse;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostDetailResponse {
    String title;
    String imageUrl;
    BoardingHouseResponse boardingHouse;
    ProfileResponse userProfile;
}
