package com.example.good_lodging_service.dto.response.Bill;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillResponse {
    Long id;
    String payerName;
    Instant dueDate;
    Instant paymentDate;
    Float fineAmount;
    Float roomRent;
    Float otherPrice;
    Long electricityUsage;
    Long waterUsage;
    Float electricityPrice;
    Float waterPrice;
    String description; // ví dụ: “Thanh toán tiền phòng tháng 4 + điện nước”
    Integer status;
}
