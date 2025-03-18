package com.example.good_lodging_service.dto.request.BoardingHouse;

import com.example.good_lodging_service.dto.request.Address.AddressRequest;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BoardingHouseUpdateRequest {
    Long userId;
    String name;
    String description;
    Float electricityPrice;
    Float waterPrice;
    Float roomRent;
    Float roomArea;

    String features;
}
