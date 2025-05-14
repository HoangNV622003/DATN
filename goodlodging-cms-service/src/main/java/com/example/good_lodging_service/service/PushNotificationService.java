package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.*;
import com.example.good_lodging_service.dto.request.Notification.PushNotificationRequest;
import com.example.good_lodging_service.dto.request.Notification.SendEmailRequest;
import com.example.good_lodging_service.dto.request.Otp.OtpRequest;
import com.example.good_lodging_service.dto.request.Otp.ValidateOtpRequest;
import com.example.good_lodging_service.entity.OTP;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.producer.KafkaProducer;
import com.example.good_lodging_service.repository.OTPRepository;
import com.example.good_lodging_service.utils.DateTimeUtils;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PushNotificationService {

    KafkaProducer kafkaProducer;
    OTPRepository otpRepository;
    Map<String, Instant> lastSentTimes = new ConcurrentHashMap<>(); // Lưu thời gian gửi OTP cuối

    private static final DateTimeFormatter formatter = DateTimeFormatter
            .ofPattern("yyyy-MM-dd HH:mm:ss")
            .withZone(ZoneId.systemDefault());

    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    @Transactional
    public Instant sendOtp(OtpRequest request) {
        // Kiểm tra tần suất gửi OTP
        Instant lastSent = lastSentTimes.get(request.getEmail());
        if (lastSent != null && lastSent.plusSeconds(30).isAfter(Instant.now())) {
            throw new AppException(ApiResponseCode.OTP_REQUEST_TOO_FREQUENT);
        }

        // Kiểm tra email
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new AppException(ApiResponseCode.INVALID_REQUEST_EMAIL);
        }

        // Tìm OTP hiện có
        Optional<OTP> existingOtp = otpRepository.findFirstByEmailOrderByExpiryTimeDesc(request.getEmail());
        OTP otp;
        if (existingOtp.isPresent()) {
            otp = existingOtp.get();
            otp.setOtp(generateOTP());
            otp.setExpiryTime(Instant.now().plus(OTPConstant.OTP_EXPIRE_TIME_MINUTES.getValue(), java.time.temporal.ChronoUnit.MINUTES));
        } else {
            otp = OTP.builder()
                    .email(request.getEmail())
                    .otp(generateOTP())
                    .expiryTime(Instant.now().plus(OTPConstant.OTP_EXPIRE_TIME_MINUTES.getValue(), java.time.temporal.ChronoUnit.MINUTES))
                    .build();
        }

        // Lưu OTP
        otpRepository.save(otp);
        lastSentTimes.put(request.getEmail(), Instant.now());

        // Gửi email ngoài giao dịch
        String expiryTimeStr = DateTimeUtils.format(otp.getExpiryTime(), ZoneId.of(ConstantsAll.ZoneId));
        String messageBody = String.format("Your OTP is %s. It expires at %s.", otp.getOtp(), expiryTimeStr);
        sendOtpToEmail(request, otp.getOtp(), messageBody);

        return otp.getExpiryTime();
    }

    public void saveOtp(PushNotificationRequest request) {
        otpRepository.save(OTP.builder()
                .otp(request.getBody())
                .phoneNumber(request.getChannel().equals(NotificationTypeConstant.SMS.name()) ? request.getRecipient() : null)
                .email(request.getChannel().equals(NotificationTypeConstant.EMAIL.name()) ? request.getRecipient() : null)
                .expiryTime(Instant.now().plus(OTPConstant.OTP_EXPIRE_TIME_MINUTES.getValue(), java.time.temporal.ChronoUnit.MINUTES))
                .build());
    }

    public void pushNotificationToUser(PushNotificationRequest request) {
        kafkaProducer.sendMessageToNotificationKafka(
                PushNotificationRequest.builder()
                        .channel(NotificationTypeConstant.NOTIFY.name())
                        .recipient(request.getRecipient())
                        .subject(MessageSubjectConstant.OTP.name())
                        .body(request.getBody())
                        .build());
    }

    public void pushMessageEmailToUser(SendEmailRequest request) {
        kafkaProducer.sendMessageToEmailKafka(request);
    }

    public boolean validateOtp(ValidateOtpRequest request) {
        OTP otp = otpRepository.findFirstByEmailOrderByExpiryTimeDesc(request.getEmail()).orElse(null);
        if (otp == null || !otp.getOtp().equals(request.getOtp())) {
            throw new AppException(ApiResponseCode.INVALID_OTP);
        }
        if (otp.getExpiryTime().isBefore(Instant.now())) {
            throw new AppException(ApiResponseCode.OTP_EXPIRED);
        }
        otpRepository.delete(otp);
        return true;
    }

    @Transactional
    public Instant resendOtp(OtpRequest request) {
        return sendOtp(request); // Tái sử dụng sendOtp với logic đã tối ưu
    }

    private void sendOtpToEmail(OtpRequest request, String otpValue, String messageBody) {
        saveOtp(PushNotificationRequest.builder()
                .channel(NotificationTypeConstant.EMAIL.name())
                .recipient(request.getEmail())
                .body(otpValue)
                .build());

        pushMessageEmailToUser(SendEmailRequest.builder()
                .email(request.getEmail())
                .message(messageBody)
                .build());
    }
}