package com.example.good_lodging_service.dto.response.BoardingHouse;

import com.example.good_lodging_service.dto.response.Image.ImageResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BoardingHouseDetailResponse {
    Long id;
    Long userId;
    String name;
    String description;
    String address;
    Float roomRent;
    Float electricityPrice;
    Float waterPrice;
    String features;
    List<ImageResponse> images;
    List<RoomResponse> rooms;
}
