package com.example.good_lodging_service.dto.response.Room;

import com.example.good_lodging_service.dto.response.Member.MemberResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import lombok.*;

import java.util.List;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDetailResponse {
    RoomResponse room;
    List<MemberResponse> users;
}
