package com.example.good_lodging_service.dto.request.Bill;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentRequest {
    String ipAddress;
    Long amount;
    Long invoiceId;
}
