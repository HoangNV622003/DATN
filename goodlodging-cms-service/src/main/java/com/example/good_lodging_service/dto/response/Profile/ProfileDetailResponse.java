package com.example.good_lodging_service.dto.response.Profile;

import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseDetailResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
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
public class ProfileDetailResponse {
    UserResponseDTO user;
    List<BoardingHouseDetailResponse> boardingHouses;
    List<RoomResponse> rooms;
}
