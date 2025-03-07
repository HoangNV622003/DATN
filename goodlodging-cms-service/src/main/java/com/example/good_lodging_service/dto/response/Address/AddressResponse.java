package com.example.good_lodging_service.dto.response.Address;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressDetailResponse {
    Long id;
    Integer houseNumber;
    String streetName;
    Long wardsId;
    Long districtId;
    Long provinceId;
    String fullAddress;
    Integer status;
}
