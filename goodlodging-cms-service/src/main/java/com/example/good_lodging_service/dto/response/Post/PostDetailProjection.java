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
    Float getArea();
    Float getRoomRent();
    String getPhoneNumber();
    String getFeatures();
    Float getWaterPrice();
    Float getElectricityPrice();
    Integer getFloor();
    Instant getModifiedDate();
}
