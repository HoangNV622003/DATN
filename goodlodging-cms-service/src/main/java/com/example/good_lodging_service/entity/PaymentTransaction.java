package com.example.good_lodging_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentTransaction extends AbstractAuditingEntity implements Serializable {
        @Serial
        private static final long serialVersionUID = 1L;
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Long id;
        Long roomId;
        Long payerId;
        Instant dueDate;
        Instant paymentDate;
        Float fineAmount;
        Float roomRent;
        Float otherPrice;
        Long electricityUsage;
        Long waterUsage;
        Float electricityPrice;
        Float waterPrice;
        Integer status; // PENDING, PAID, CANCELLED, etc.
        String description;
}
