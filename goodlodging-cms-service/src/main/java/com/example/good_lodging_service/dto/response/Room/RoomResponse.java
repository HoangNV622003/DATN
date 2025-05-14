package com.example.good_lodging_service.dto.response.Room;

import com.example.good_lodging_service.entity.Device;
import com.example.good_lodging_service.entity.User;
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
    Integer capacity;
    Float price;
    Float area;
    Integer floor;
}
