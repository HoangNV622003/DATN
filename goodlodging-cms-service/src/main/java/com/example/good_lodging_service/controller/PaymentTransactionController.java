package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.PaymentTransaction.PaymentTransactionRequest;
import com.example.good_lodging_service.dto.response.PaymentTransaction.PaymentTransactionResponse;
import com.example.good_lodging_service.service.PaymentTransactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentTransactionController {
    PaymentTransactionService paymentTransactionService;
    @PutMapping("/{id}/confirm")
    public ResponseEntity<PaymentTransactionResponse> confirmPaymentTransaction(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(paymentTransactionService.confirmPayment(id, userId));
    }
}
