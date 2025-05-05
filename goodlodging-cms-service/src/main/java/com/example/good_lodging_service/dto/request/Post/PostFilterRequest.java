package com.example.good_lodging_service.dto.request.Post;

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
public class PostFilterRequest {
     List<Long> wardsId;
     Float minRent;
     Float maxRent;
     Float minArea;
     Float maxArea;
     Float minElectricityPrice;
     Float maxElectricityPrice;
     Float minWaterPrice;
     Float maxWaterPrice;
     String features;
     String description;
     List<Integer> roomType;
}
