package com.example.good_lodging_service.dto.response.Address;

import com.example.good_lodging_service.entity.Address;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressDetailResponse {
    Long provinceId;
    String provinceName;
    List<DistrictResponse> districts;
}

