package com.example.good_lodging_service.dto.response.RoomUser;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomUserResponse {
    Long id;
    Long roomId;
    Long userId;
}