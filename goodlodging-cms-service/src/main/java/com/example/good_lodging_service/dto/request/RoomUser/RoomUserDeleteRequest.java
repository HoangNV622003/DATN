package com.example.good_lodging_service.dto.request.RoomUser;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomUserDeleteRequest {
    Long userId;
    Long roomId;
}
