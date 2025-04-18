package com.example.good_lodging_service.dto.response.BoardingHouse;

import com.example.good_lodging_service.dto.response.Address.AddressResponse;
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
    Float maxRent;
    Float minRent;
    Float maxArea;
    Float minArea;
    Float electricityPrice;
    Float otherPrice;
    Float waterPrice;
    String features;
    AddressResponse address;
    List<ImageResponse> images;
    List<RoomResponse> rooms;
}
