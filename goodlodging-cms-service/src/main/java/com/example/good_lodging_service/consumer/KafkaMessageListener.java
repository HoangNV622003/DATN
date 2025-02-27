package com.example.good_lodging_service.consumer;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CountryCode;
import com.example.good_lodging_service.constants.KafkaConfigConstants;
import com.example.good_lodging_service.dto.request.Notification.PushNotificationRequest;
import com.example.good_lodging_service.dto.request.Notification.SendEmailRequest;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KafkaMessageListener {

    EmailService emailService;


    @KafkaListener(topics = KafkaConfigConstants.NOTIFICATION_TOPIC, groupId = KafkaConfigConstants.GROUP_ID)
    public void pushNotificationListener(PushNotificationRequest message) {
        try {
            log.info("message: {}", message);
        } catch (Exception e) {
            log.error("ERROR: ", e);
            throw new AppException(ApiResponseCode.INTERNAL_SERVER_ERROR);
        }
    }

    @KafkaListener(topics = KafkaConfigConstants.MAIL_TOPIC, groupId = KafkaConfigConstants.GROUP_ID)
    public void sendMailListener(SendEmailRequest message) {
        try {

            log.info("message: {}", message);
            emailService.sendEmail(message);
        } catch (Exception e) {
            log.error("SEND EMAIL ERROR: ", e);
            throw new AppException(ApiResponseCode.CANNOT_SEND_EMAIL);
        }

    }


}
