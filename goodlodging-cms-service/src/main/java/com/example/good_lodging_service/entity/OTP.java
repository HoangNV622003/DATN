package com.example.good_lodging_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Entity
@Getter
@Setter
@Builder
@Table(name = "otp", indexes = {
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_phone_number", columnList = "phoneNumber")
})
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OTP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String email;
    String phoneNumber;
    String otp;
    Instant expiryTime;
}
