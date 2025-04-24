package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.ConstantsAll;
import com.example.good_lodging_service.constants.PaymentStatus;
import com.example.good_lodging_service.dto.request.Payment.PaymentRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.PaymentTransaction.PaymentResponse;
import com.example.good_lodging_service.entity.PaymentTransaction;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.repository.PaymentTransactionRepository;
import com.example.good_lodging_service.security.SecurityUtils;
import com.example.good_lodging_service.security.configuration.VNPayConfig;
import com.example.good_lodging_service.utils.VNPAYUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.security.auth.login.Configuration;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;

import static com.example.good_lodging_service.security.configuration.VNPayConfig.vnp_ApiUrl;
import static com.example.good_lodging_service.security.configuration.VNPayConfig.vnp_ReturnUrl;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class VNPayService {

    private final PaymentTransactionRepository paymentTransactionRepository;

    public PaymentResponse createOrder(PaymentRequest request) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderType = "billpayment";
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
        PaymentTransaction paymentTransaction= paymentTransactionRepository.findByIdAndStatusNot(invoiceId, PaymentStatus.DELETED.getValue()).orElseThrow(
                ()-> new AppException(ApiResponseCode.PAYMENT_FAILED));
        //save order
        paymentTransaction.setPayerId(payerId);
        paymentTransaction.setPaymentDate(Instant.now());
        paymentTransaction.setStatus(PaymentStatus.PAID.getValue());
        paymentTransactionRepository.save(paymentTransaction);

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
