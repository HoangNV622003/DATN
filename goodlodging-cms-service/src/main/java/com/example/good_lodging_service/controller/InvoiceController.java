package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.PaymentTransaction.PaymentTransactionRequest;
import com.example.good_lodging_service.dto.response.Invoice.InvoiceResponse;
import com.example.good_lodging_service.dto.response.PaymentTransaction.PaymentTransactionResponse;
import com.example.good_lodging_service.service.PaymentTransactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoice")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvoiceController {
    PaymentTransactionService paymentTransactionService;

    @GetMapping
    public ResponseEntity<InvoiceResponse> getAllPaymentTransactionsWithRoomId(@RequestParam("roomId") Long roomId) {
        return ResponseEntity.ok(paymentTransactionService.findAllByRoomId(roomId));
    }

    @GetMapping("/my-invoice")
    public ResponseEntity<InvoiceResponse> getMyPaymentTransactionsWithUserId(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(paymentTransactionService.findAllByUserId(userId));
    }
    @PostMapping
    public ResponseEntity<PaymentTransactionResponse> createPaymentTransaction(@RequestBody PaymentTransactionRequest paymentTransactionRequest) {
        return ResponseEntity.ok(paymentTransactionService.createPaymentTransaction(paymentTransactionRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentTransactionResponse> updatePaymentTransaction(@PathVariable Long id, @RequestBody PaymentTransactionRequest paymentTransactionRequest) {
        return ResponseEntity.ok(paymentTransactionService.updatePaymentTransaction(id, paymentTransactionRequest));
    }

}
