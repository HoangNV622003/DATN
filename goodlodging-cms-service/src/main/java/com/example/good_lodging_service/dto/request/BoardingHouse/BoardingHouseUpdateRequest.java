package com.example.good_lodging_service.dto.request.BoardingHouse;

import com.example.good_lodging_service.dto.request.Address.AddressRequest;
import com.example.good_lodging_service.dto.request.Image.ImageFileRequest;
import com.example.good_lodging_service.dto.request.Image.ImageRequest;
import com.example.good_lodging_service.dto.response.Address.AddressResponse;
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
public class BoardingHouseUpdateRequest {
    Long userId;
    String name;
    String description;
    Float electricityPrice;
    Float waterPrice;
    Float roomRent;
    Float roomArea;
    String features;
    List<ImageRequest> imageUrls;
    List<ImageFileRequest> imageFiles;
    AddressRequest address;

}

