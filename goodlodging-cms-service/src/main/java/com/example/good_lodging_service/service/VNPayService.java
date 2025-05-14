package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.BillStatus;
import com.example.good_lodging_service.dto.request.Bill.PaymentRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Bill.PaymentResponse;
import com.example.good_lodging_service.entity.Bill;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.repository.BillRepository;
import com.example.good_lodging_service.security.configuration.VNPayConfig;
import com.example.good_lodging_service.utils.VNPAYUtil;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class VNPayService {

    private final BillRepository billRepository;

    public PaymentResponse createOrder(PaymentRequest request) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderType = "bill";
        String vnp_TxnRef = String.valueOf(System.currentTimeMillis());
        String vnp_Locale = "vn";
        String vnp_CurrCode = "VND";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(request.getAmount() * 100));
        vnp_Params.put("vnp_CurrCode", vnp_CurrCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Ma_hoa_don_"+request.getInvoiceId());
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", vnp_Locale);
        vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", request.getIpAddress());
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String vnp_SecureHash = VNPAYUtil.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);

        return PaymentResponse.builder()
                .URL(VNPayConfig.vnp_PayUrl + "?" + query.toString()) // Sử dụng vnp_PayUrl thay vì vnp_ApiUrl
                .message("Tạo URL thanh toán thành công")
                .status("200")
                .build();
    }

    public CommonResponse transaction(String vnp_ResponseCode, String vnp_OrderInfo,Long payerId) {
        if (!vnp_ResponseCode.equals("00")) throw new AppException(ApiResponseCode.PAYMENT_FAILED);
        Long invoiceId = extractInvoiceNumber(vnp_OrderInfo);
        Bill bill = billRepository.findByIdAndStatusNot(invoiceId, BillStatus.DELETED.getValue()).orElseThrow(
                ()-> new AppException(ApiResponseCode.PAYMENT_FAILED));
        //save order
        bill.setPayerId(payerId);
        bill.setPaymentDate(Instant.now());
        bill.setStatus(BillStatus.PAID.getValue());
        billRepository.save(bill);

        return CommonResponse.builder().status(ApiResponseCode.PAYMENT_SUCCESSFUL.getCode())
                .result(ApiResponseCode.PAYMENT_SUCCESSFUL.getMessage())
                .build();
    }
    public Long extractInvoiceNumber(String invoiceCode) {
        if (invoiceCode == null || invoiceCode.isEmpty()) {
            return null; // Hoặc throw exception tùy yêu cầu
        }
        String[] parts = invoiceCode.split("_");
        String invoiceId= parts[parts.length - 1]; // Lấy phần tử cuối
        try{
            return Long.parseLong(invoiceId);
        } catch (Exception e) {
            log.error("INVOICE ID không hợp lệ");
            throw new AppException(ApiResponseCode.PAYMENT_FAILED);
        }
    }
}
