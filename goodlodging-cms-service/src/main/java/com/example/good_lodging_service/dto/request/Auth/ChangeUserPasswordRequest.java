package com.example.good_lodging_service.dto.request.Auth;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeUserPasswordRequest {
    String currentPassword;
    String newPassword;
    String confirmNewPassword;
}
