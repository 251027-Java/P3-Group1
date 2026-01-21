package com.example.React_spring_service.Services;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProducerService {

    // private final KafkaTemplate<String, UserUpdateEvent> kafkaTemplate;
    // private static final String TOPIC = "user-updates";
    // private static final String TESTTOPIC = "test-update";

    // ic void sendMessage(User user, String action) {
    // teEvent event = UserUpdateEvent.builder()
    // .userId(user.getId())
    // .username(user.getUsername())
    // .avatarUrl(user.getAvatarUrl())
    // .action(action) // e.g., "UPDATE"
    // .build();

    // // Sending with userId as the Key ensures order consistency
    // kafkaTemplate.send(TOPIC, user.getId().toString(), event);
    //

    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final String TESTTOPIC = "test-update";

    public void sendMessage(String message, String key) {

        // Sending with userId as the Key ensures order consistency
        kafkaTemplate.send(TESTTOPIC, key, message);
        System.out.println("Sent user update to Kafka: " + message);
    }
}
