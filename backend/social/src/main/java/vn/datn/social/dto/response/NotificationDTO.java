package vn.datn.social.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.datn.social.constant.NotificationType;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String contentnoti;
    private LocalDateTime timestamp;
    private String status;
    private NotificationType type;
    private String sender_username;
}
