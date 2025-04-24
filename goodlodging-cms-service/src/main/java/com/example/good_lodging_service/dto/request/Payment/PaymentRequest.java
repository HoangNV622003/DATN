package com.example.good_lodging_service.dto.request.Payment;

import jakarta.servlet.http.HttpServletRequest;
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
