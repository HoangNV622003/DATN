package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.request.PaymentTransaction.PaymentTransactionRequest;
import com.example.good_lodging_service.dto.response.PaymentTransaction.PaymentTransactionResponse;
import com.example.good_lodging_service.entity.PaymentTransaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentTransactionMapper {
    PaymentTransactionResponse toPaymentTransactionResponse(PaymentTransaction paymentTransaction);
    PaymentTransaction toPaymentTransaction(PaymentTransactionRequest paymentTransactionRequest);
}
