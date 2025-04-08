package com.example.good_lodging_service.dto.response.Post;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.Instant;


public interface PostProjection {
    Long getId();
    String getTitle();
    String getImageUrl();
    Float getMaxArea();
    Float getMinArea();
    Float getMaxRent();
    Float getMinRent();
    String getAddress();
    Long getBoardingHouseId();
    Long getUserId();
    Instant getModifiedDate();
    Integer getType();
}
