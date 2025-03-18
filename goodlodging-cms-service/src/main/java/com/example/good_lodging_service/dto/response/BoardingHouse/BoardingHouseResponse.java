package com.example.good_lodging_service.dto.response.BoardingHouse;

import com.example.good_lodging_service.dto.response.Post.PostDetailProjection;
import com.example.good_lodging_service.entity.BoardingHouse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BoardingHouseResponse {
    Long id;
    List<String> imageUrl;
    String name;
    String address;
    String description;
    Float roomArea;
    Float roomRent;
    Float electricityPrice;
    Float waterPrice;
    String features;
    public static BoardingHouseResponse fromPostDetailProjection(PostDetailProjection postDetailProjection) {
        return BoardingHouseResponse.builder()
                .id(postDetailProjection.getBoardingHouseId())
                .name(postDetailProjection.getBoardingHouseName())
                .address(postDetailProjection.getAddress())
                .description(postDetailProjection.getDescription())
                .roomRent(postDetailProjection.getRoomRent())
                .electricityPrice(postDetailProjection.getElectricityPrice())
                .waterPrice(postDetailProjection.getWaterPrice())
                .features(postDetailProjection.getFeatures())
                .build();
    }
}
