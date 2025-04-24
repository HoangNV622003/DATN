package com.example.good_lodging_service.dto.request.Payment;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentTransactionRequest {
    Long roomId;
    Instant dueDate;
    Float fineAmount;
    Long electricityUsage;
    Long waterUsage;
    String description; // ví dụ: “Thanh toán tiền phòng tháng 4 + điện nước”
}
