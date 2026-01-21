package com.example.React_spring_service.Dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateEvent {
    private Long userId; // The ID from the Identity DB
    private String username;
    private String avatarUrl;
    private String action; // "CREATE", "UPDATE", or "DELETE"
}