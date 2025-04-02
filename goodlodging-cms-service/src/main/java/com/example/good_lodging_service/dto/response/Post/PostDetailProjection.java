package com.example.good_lodging_service.dto.response.Post;

import java.time.Instant;

public interface PostDetailProjection {
    Long getPostId();
    Long getUserId();
    Long getRoomId();
    Long getBoardingHouseId();
    String getUrlAvatar();
    String getBoardingHouseName();
    String getAddress();
    String getTitle();
    String getDescription();
    String getFullName();
    String getEmail();
    Float getMaxArea();
    Float getMinArea();
    Float getMaxRent();
    Float getMinRent();
    String getPhoneNumber();
    String getFeatures();
    Float getWaterPrice();
    Float getElectricityPrice();
    Float getOtherPrice();
    Instant getModifiedDate();
}
