package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.Bill.PaymentRequest;
import com.example.good_lodging_service.dto.response.Bill.PaymentResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/vn-pay")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VNPayController {
    VNPayService vnPayService;

    @PostMapping
    ResponseEntity<PaymentResponse> createPaymentTransaction(HttpServletRequest httpServletRequest, @RequestBody PaymentRequest request) throws UnsupportedEncodingException {
        request.setIpAddress(httpServletRequest.getRemoteAddr());
        return ResponseEntity.ok(vnPayService.createOrder(request));
    }

    @GetMapping
    ResponseEntity<CommonResponse> transaction(
            @RequestParam(value = "vnp_ResponseCode") String vnp_ResponseCode,
            @RequestParam(value = "vnp_OrderInfo") String vnp_OrderInfo,
            @RequestParam(value = "payerId") Long payerId) {
        return ResponseEntity.ok(vnPayService.transaction(vnp_ResponseCode, vnp_OrderInfo, payerId));
    }
}
