package com.example.good_lodging_service.dto.request.BoardingHouse;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BoardingHouseRequest {
    Long userId;
    String name;
    String address;
    String phone;
    String email;
    Float electricityPrice;
    Float waterPrice;
    Boolean hasElevator;
}
