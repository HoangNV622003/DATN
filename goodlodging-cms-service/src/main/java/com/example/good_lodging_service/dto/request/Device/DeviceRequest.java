package com.example.good_lodging_service.dto.request.Device;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeviceRequest {
    Long roomId;
    String name;
    String description;
    String deviceStatus;
    Integer status;
}
