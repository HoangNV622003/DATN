package com.example.good_lodging_service.dto.response.Member;

import java.time.Instant;
import java.time.LocalDate;

public interface MemberProjection {
    Long getId();
    String getFullName();
    String getEmail();
    String getPhoneNumber();
    String getUsername();
    String getImageUrl();
    String getGender();
    LocalDate getDateOfBirth();
    Instant getUpdatedAt();
}
