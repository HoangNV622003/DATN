package com.example.good_lodging_service.dto.request.Room;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomRequest {
    Long boardingHouseId;
    String name;
    Float price;
    Float area;
    Integer capacity;
    Integer floor;
}
