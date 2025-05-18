package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.Bill.BillRequest;
import com.example.good_lodging_service.dto.response.Bill.BillResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Invoice.InvoiceResponse;
import com.example.good_lodging_service.service.BillService;
import com.example.good_lodging_service.service.VNPayService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/bill")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillController {
    BillService billService;

    @PutMapping("/{id}/confirm")
    public ResponseEntity<BillResponse> confirmPaymentTransaction(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(billService.confirmPayment(id, userId));
    }

    @GetMapping
    public ResponseEntity<InvoiceResponse> getAllPaymentTransactionsWithRoomId(@RequestParam("roomId") Long roomId) {
        return ResponseEntity.ok(billService.findAllByRoomId(roomId));
    }

    @GetMapping("/my-bill")
    public ResponseEntity<InvoiceResponse> getMyPaymentTransactionsWithUserId(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(billService.findAllByUserId(userId));
    }
    @PostMapping
    public ResponseEntity<BillResponse> createPaymentTransaction(@RequestBody BillRequest billRequest) {
        return ResponseEntity.ok(billService.createPaymentTransaction(billRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BillResponse> updatePaymentTransaction(@PathVariable Long id, @RequestBody BillRequest billRequest) {
        return ResponseEntity.ok(billService.updatePaymentTransaction(id, billRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CommonResponse> deletePaymentTransaction(@PathVariable Long id) {
        return ResponseEntity.ok(billService.deleteBill(id));
    }
}
