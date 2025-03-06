package com.example.good_lodging_service.dto.response.Profile;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileResponse {
    Long userId;
    String fullName;
    String profileImageUrl;
    String email;
    String phoneNumber;
}
