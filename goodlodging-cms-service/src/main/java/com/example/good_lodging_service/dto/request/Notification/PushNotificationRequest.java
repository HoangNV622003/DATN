package com.example.good_lodging_service.dto.request.Notification;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PushNotificationRequest {
    String channel;
    String recipient;
    String templateCode;
    Map<String, Object> params;
    String subject;
    String body;
}
