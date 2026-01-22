package com.example.Angular_spring_service.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Angular_spring_service.Dtos.AuthResponse;
import com.example.Angular_spring_service.Dtos.LoginRequest;
import com.example.Angular_spring_service.Dtos.RegisterRequest;
import com.example.Angular_spring_service.Entities.User;
import com.example.Angular_spring_service.Repositories.UserRepository;
import com.example.Angular_spring_service.utils.JwtUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    /**
     * Register a new user
     * 
     * @param request Registration details
     * @return AuthResponse with JWT token
     * @throws RuntimeException if username already exists
     */
    public AuthResponse registerUser(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Create new user with encrypted password
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .avatarUrl(request.getAvatarUrl())
                .enabled(true)
                .build();

        // Save user to database
        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtils.generateToken(savedUser.getUsername());

        // Return response with token
        return AuthResponse.builder()
                .token(token)
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .avatarUrl(savedUser.getAvatarUrl())
                .build();
    }

    /**
     * Authenticate user and generate JWT token
     * 
     * @param request Login credentials
     * @return AuthResponse with JWT token
     * @throws RuntimeException if credentials are invalid
     */
    public AuthResponse authenticateUser(LoginRequest request) {
        // Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT token
        String token = jwtUtils.generateToken(user.getUsername());

        // Return response with token
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    /**
     * Get user by username
     * 
     * @param username Username to search for
     * @return User entity
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
