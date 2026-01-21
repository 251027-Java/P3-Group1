package com.example.React_spring_service.Repositories;

import com.example.React_spring_service.Entities.PlayableGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for playable browser games (Bubble Trouble, Flappy Bird, etc.)
 */
@Repository
public interface PlayableGameRepository extends JpaRepository<PlayableGame, Long> {
    
    // Find playable game by name
    Optional<PlayableGame> findByName(String name);
    
    // Check if playable game exists by name
    boolean existsByName(String name);
}
