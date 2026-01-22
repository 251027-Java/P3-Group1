package com.example.React_spring_service.Services;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.HashMap;

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
    private static final String NOTIFICATION_TOPIC = "notifications";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendMessage(String message, String key) {

        // Sending with userId as the Key ensures order consistency
        kafkaTemplate.send(TESTTOPIC, key, message);
        System.out.println("Sent user update to Kafka: " + message);
    }

    /**
     * Send a notification message to Kafka
     * @param userId The user ID
     * @param notificationType The type of notification (e.g., "GAME_PURCHASED", "GAME_PLAYED")
     * @param message The notification message
     * @param metadata Additional metadata for the notification
     */
    public void sendNotification(Long userId, String notificationType, String message, Map<String, Object> metadata) {
        try {
            Map<String, Object> notification = new HashMap<>();
            notification.put("userId", userId);
            notification.put("type", notificationType);
            notification.put("message", message);
            notification.put("timestamp", System.currentTimeMillis());
            if (metadata != null) {
                notification.putAll(metadata);
            }

            String notificationJson = objectMapper.writeValueAsString(notification);
            kafkaTemplate.send(NOTIFICATION_TOPIC, userId.toString(), notificationJson);
            System.out.println("Sent notification to Kafka: " + notificationJson);
        } catch (Exception e) {
            System.err.println("Error sending notification to Kafka: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
