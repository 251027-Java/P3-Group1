package com.example.React_spring_service.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents playable browser games (Bubble Trouble, Flappy Bird, etc.)
 * Separate from store Game entity which handles marketplace games
 */
@Entity
@Table(name = "playable_games")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayableGame {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "playableGame", cascade = CascadeType.ALL)
    private List<GameScore> scores;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
