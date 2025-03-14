package com.example.good_lodging_service.dto.request.BoardingHouse;

import com.example.good_lodging_service.dto.request.Address.AddressRequest;
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
public class BoardingHouseRequest {
    Long userId;
    String name;
    String description;
    Float roomRent;
    Float electricityPrice;
    Float waterPrice;
    String features;
    AddressRequest address;
}
