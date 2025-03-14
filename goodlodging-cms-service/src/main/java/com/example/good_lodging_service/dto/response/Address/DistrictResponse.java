package com.example.good_lodging_service.dto.response.Address;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DistrictResponse {
    Long districtId;
    String districtName;
    List<WardsResponse> wards;
}
