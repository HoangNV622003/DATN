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
    Float maxArea;
    Float minArea;
    Float maxRent;
    Float minRent;
    Float electricityPrice;
    Float waterPrice;
    Float otherPrice;
    String features;
    public static BoardingHouseResponse fromPostDetailProjection(PostDetailProjection postDetailProjection) {
        return BoardingHouseResponse.builder()
                .id(postDetailProjection.getBoardingHouseId())
                .name(postDetailProjection.getBoardingHouseName())
                .address(postDetailProjection.getAddress())
                .description(postDetailProjection.getDescription())
                .maxRent(postDetailProjection.getMaxRent())
                .minRent(postDetailProjection.getMinRent())
                .maxArea(postDetailProjection.getMaxArea())
                .minArea(postDetailProjection.getMinArea())
                .electricityPrice(postDetailProjection.getElectricityPrice())
                .waterPrice(postDetailProjection.getWaterPrice())
                .features(postDetailProjection.getFeatures())
                .otherPrice(postDetailProjection.getOtherPrice())
                .build();
    }
}
