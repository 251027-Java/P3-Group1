package com.example.React_spring_service.Services;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.example.React_spring_service.Dtos.UserUpdateEvent;
import com.example.React_spring_service.Entities.User;
import com.example.React_spring_service.Repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserConsumerService {

    private final UserRepository userRepository;

    @KafkaListener(topics = "user-updates", groupId = "community-group")
    public void consumeUserUpdate(UserUpdateEvent event) {
        System.out.println("Received update for: " + event.getUsername());

    }
}
