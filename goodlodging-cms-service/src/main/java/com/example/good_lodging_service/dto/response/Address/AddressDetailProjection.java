package com.example.good_lodging_service.dto.response.Address;

public interface AddressDetailProjection {
    Long getWardsId();
    String getWardsName();
    Long getDistrictId();
    String getDistrictName();
    Long getProvinceId();
    String getProvinceName();
}
