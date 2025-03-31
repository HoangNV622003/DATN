package com.example.good_lodging_service.dto.request.RoomUser;

import com.example.good_lodging_service.entity.AbstractAuditingEntity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomUserRequest {
    Long roomId;
    String username;
}