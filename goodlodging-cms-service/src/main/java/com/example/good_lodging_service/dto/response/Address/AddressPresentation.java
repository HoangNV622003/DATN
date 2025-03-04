package com.example.good_lodging_service.dto.response.Address;

public interface AddressPresentation {
    Long getBoardingHouseId();
    Long getAddressId();
    Long getProvinceId();
    Long getDistrictId();
    Long getWardsId();
    String getStreetName();
    Integer getHouseNumber();
    String getFullAddress();
}
