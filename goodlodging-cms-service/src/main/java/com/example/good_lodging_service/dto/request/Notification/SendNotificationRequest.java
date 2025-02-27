package com.example.good_lodging_service.dto.request.Notification;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendNotificationRequest {
    String email;
    String title;
}
