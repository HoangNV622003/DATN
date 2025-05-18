package com.example.good_lodging_service.dto.response.RoomUser;


public interface RoomUserProjection {
    Long getUserId();
    Long getRoomId();
    Long getBoardingHouseId();
    String getFirstName();
    String getLastName();
    String getEmail();
    String getPhoneNumber();
    String getImageUrl();
    String getAddress();
    String getBoardingHouseName();
    Float getWaterPrice();
    Float getElectricityPrice();
    Float getOtherPrice();
    String getFeatures();
}
