package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.*;
import com.example.good_lodging_service.dto.request.Notification.SendEmailRequest;
import com.example.good_lodging_service.dto.response.Email.EmailResponse;
import com.example.good_lodging_service.exception.AppException;
import lombok.AccessLevel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    MailSender mailSender;
    @NonFinal
    @Value("${spring.mail.username}")
    String sender;

    public void sendEmail(SendEmailRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getEmail());
        message.setSubject(MessageSubjectConstant.OTP.name());
        message.setFrom(sender);
        message.setText(request.getMessage());
        mailSender.send(message);


    }
}
