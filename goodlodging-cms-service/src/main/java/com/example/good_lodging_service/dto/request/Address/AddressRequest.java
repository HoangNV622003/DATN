package com.example.good_lodging_service.dto.request.Address;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressRequest {
    Integer houseNumber;
    String street;
    Long wardsId;
    Long districtId;
    Long provinceId;
}
