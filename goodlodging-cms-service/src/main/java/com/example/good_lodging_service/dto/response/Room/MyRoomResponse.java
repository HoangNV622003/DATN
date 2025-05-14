package com.example.good_lodging_service.dto.response.Room;

import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.Bill.BillResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MyRoomResponse {
    RoomDetailResponse roomDetail;
    UserResponseDTO host;
    BoardingHouseResponse boardingHouse;
    List<BillResponse> payments;
}
