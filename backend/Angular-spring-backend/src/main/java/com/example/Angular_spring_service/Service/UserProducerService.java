package com.example.Angular_spring_service.Service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.example.Angular_spring_service.Dtos.UserUpdateEvent;
import com.example.Angular_spring_service.Entities.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProducerService {

    private final KafkaTemplate<String, UserUpdateEvent> kafkaTemplate;
    private static final String TOPIC = "user-updates";

    public void sendMessage(User user, String action) {
        UserUpdateEvent event = UserUpdateEvent.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .action(action) // e.g., "UPDATE"
                .build();

        // Sending with userId as the Key ensures order consistency
        kafkaTemplate.send(TOPIC, user.getId().toString(), event);
        System.out.println("Sent user update to Kafka: " + event.getUsername());
    }
}
