package com.example.Angular_spring_service.Service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.example.Angular_spring_service.Dtos.UserUpdateEvent;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProducerService {

    private final KafkaTemplate<String, UserUpdateEvent> kafkaTemplate;
    private static final String TOPIC = "user-events";

    public void sendUserEvent(UserUpdateEvent event) {
        Message<UserUpdateEvent> message = MessageBuilder
                .withPayload(event)
                .setHeader(KafkaHeaders.TOPIC, TOPIC)
                .setHeader(KafkaHeaders.KEY, event.getUsername())
                .build();

        kafkaTemplate.send(message);
        System.out.println("Sent user event to Kafka: " + event);
    }
}
