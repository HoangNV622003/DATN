package com.example.good_lodging_service.dto.response.Room;

import com.example.good_lodging_service.entity.Device;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomResponse {
    Long id;
    Long boardingHouseId;
    String name;
    String description;
    Float length;
    Float width;
    Integer floor;
    List<Device> devices;
}
