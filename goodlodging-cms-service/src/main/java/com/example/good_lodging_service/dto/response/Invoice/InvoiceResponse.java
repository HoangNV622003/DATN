package com.example.good_lodging_service.dto.response.Invoice;

import com.example.good_lodging_service.dto.response.PaymentTransaction.PaymentTransactionResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceResponse {
    Long roomId;
    String roomName;
    List<UserResponseDTO> members=new ArrayList<>();
    List<PaymentTransactionResponse> invoices;
}
