package com.example.React_spring_service.Services;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserConsumerService {

    private static final String TEST_TOPIC = "test-update";
    private static final String GROUP_ID = "user-update-group";

    @KafkaListener(topics = TEST_TOPIC, groupId = GROUP_ID)
    public void consume(String message) {
        try {
            System.out.println("Received message from Kafka: " + message);

            // Logic to update the second database goes here
            // Example: userRepository.updateSomething(message);

        } catch (Exception e) {
            System.err.println("Error processing Kafka message: " + e.getMessage());
        }
    }
}
