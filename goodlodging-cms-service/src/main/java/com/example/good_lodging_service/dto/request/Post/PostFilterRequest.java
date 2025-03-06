package com.example.good_lodging_service.dto.request.Post;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PostFilterRequest {
    private Long provinceId;
    private Long districtId;
    private Long wardsId;
    private Float minRoomRent;
    private Float maxRoomRent;
    private Float minArea;
    private Float maxArea;
    private Float minElectricityPrice;
    private Float maxElectricityPrice;
    private Float minWaterPrice;
    private Float maxWaterPrice;
    private String features;
    private String description;
}
