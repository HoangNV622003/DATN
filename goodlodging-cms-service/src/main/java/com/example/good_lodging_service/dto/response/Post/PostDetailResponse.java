package com.example.good_lodging_service.dto.response.Post;

import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.Profile.ProfileResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostDetailResponse {
    String title;
    Float maxArea;
    Float minArea;
    Float maxRent;
    Float minRent;
    Float electricityPrice;
    Float waterPrice;
    Float otherPrice;
    String address;
    Integer type;
    String description;
    List<String> imageUrl;
    List<RoomResponse> emptyRooms;
    ProfileResponse authorInfo;
}
