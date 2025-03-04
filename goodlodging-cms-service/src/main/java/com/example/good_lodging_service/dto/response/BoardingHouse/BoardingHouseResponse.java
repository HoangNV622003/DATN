package com.example.good_lodging_service.dto.response.BoardingHouse;

import com.example.good_lodging_service.dto.response.Address.AddressResponse;
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
public class BoardingHouseResponse {
    Long id;
    Long userId;
    String name;
    String description;
    String address;
    Float electricityPrice;
    Float waterPrice;
    String features;
    List<RoomResponse> rooms;
}
