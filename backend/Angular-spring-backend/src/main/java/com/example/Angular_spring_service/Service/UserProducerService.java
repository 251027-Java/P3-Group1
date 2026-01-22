package com.example.Angular_spring_service.Service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.example.Angular_spring_service.Dtos.UserUpdateEvent;
import com.example.Angular_spring_service.Entities.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
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
        log.info("Sent user update to Kafka (key = " + key + "): " + message);
    }

    public void logMessage(String message, int level) {
        message = "LOG MESSAGE PRACTICE LEVEL " + level + ": " + message;
        switch (level) {
            case 1:
                log.error(message);
                break;
            case 2:
                log.warn(message);
                break;
            case 3:
                log.info(message);
                break;
            case 4:
                log.debug(message);
                break;
            default:
                log.trace(message);
                break;
        }
    }
}
