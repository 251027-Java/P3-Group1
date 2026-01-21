package com.example.React_spring_service.Services;

import com.example.React_spring_service.Entities.*;
import com.example.React_spring_service.Repositories.*;
import com.example.React_spring_service.Enum.UserLevel;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RewardRepository rewardRepository;
    private final GameRepository gameRepository;

    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserByDisplayName(String displayName) {
        return userRepository.findByDisplayName(displayName);
    }

    public User updateUserProfile(Long userId, String displayName, String displayImage, UserLevel level,
            Boolean canSell) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (displayName != null && !displayName.trim().isEmpty()) {
            user.setDisplayName(displayName);
        }
        if (displayImage != null) {
            user.setDisplayImage(displayImage);
        }
        if (level != null) {
            user.setLevel(level);
        }
        if (canSell != null) {
            user.setCanSell(canSell);
        }

        return userRepository.save(user);
    }

    public User createUser(String displayName, String displayImage, UserLevel level, boolean canSell) {
        User user = User.builder()
                .displayName(displayName)
                .displayImage(displayImage)
                .level(level)
                .canSell(canSell)
                .build();
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
