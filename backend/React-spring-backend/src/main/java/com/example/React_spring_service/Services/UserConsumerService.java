package com.example.React_spring_service.Services;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.React_spring_service.Dtos.UserUpdateEvent;
import com.example.React_spring_service.Entities.User;
import com.example.React_spring_service.Enum.UserLevel;
import com.example.React_spring_service.Repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserConsumerService {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    private static final String TOPIC = "user-events";
    private static final String GROUP_ID = "react-service-group";

    @KafkaListener(topics = TOPIC, groupId = GROUP_ID)
    public void consume(String message) {
        try {
            System.out.println("Received message from Kafka: " + message);

            // Deserialize message
            UserUpdateEvent event = objectMapper.readValue(message, UserUpdateEvent.class);

            if ("CREATE".equals(event.getAction())) {
                createUser(event);
            } else if ("UPDATE".equals(event.getAction())) {
                // Implement update logic if needed
            }

        } catch (Exception e) {
            System.err.println("Error processing Kafka message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createUser(UserUpdateEvent event) {
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByDisplayName(event.getUsername());
        if (existingUser.isPresent()) {
            System.out.println("User already exists: " + event.getUsername());
            return;
        }

        // Create new user
        User newUser = User.builder()
                .displayName(event.getUsername())
                .displayImage(event.getAvatarUrl())
                .level(UserLevel.USER)
                .canSell(false)
                .build();

        userRepository.save(newUser);
        System.out.println("Created new user in React DB: " + newUser.getDisplayName());
    }
}
