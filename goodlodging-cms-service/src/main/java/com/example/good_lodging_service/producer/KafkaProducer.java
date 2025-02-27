package com.example.good_lodging_service.producer;

import com.example.good_lodging_service.constants.KafkaConfigConstants;
import com.example.good_lodging_service.dto.request.Notification.PushNotificationRequest;
import com.example.good_lodging_service.dto.request.Notification.SendEmailRequest;
import lombok.AllArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class KafkaProducer {

    private final Logger logger = LogManager.getLogger(getClass());
    private final KafkaTemplate<String, SendEmailRequest> sendEmailRequestKafkaTemplate;
    private final KafkaTemplate<String, PushNotificationRequest> pushNotifyRequestKafkaTemplate;

    @Async
    public void sendMessageToEmailKafka(final SendEmailRequest message) {
        String topic = KafkaConfigConstants.MAIL_TOPIC;
        logger.debug("Send message to topic {}: {}", topic, message);
        sendEmailRequestKafkaTemplate.send(KafkaConfigConstants.MAIL_TOPIC, message);

    }

    @Async
    public void sendMessageToNotificationKafka(final PushNotificationRequest message) {
        String topic = KafkaConfigConstants.NOTIFICATION_TOPIC;
        logger.debug("Send message to topic {}: {}", topic, message);
        pushNotifyRequestKafkaTemplate.send(KafkaConfigConstants.NOTIFICATION_TOPIC, message);
    }

}
