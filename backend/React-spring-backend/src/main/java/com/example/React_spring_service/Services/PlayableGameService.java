package com.example.React_spring_service.Services;

import com.example.React_spring_service.Entities.PlayableGame;
import com.example.React_spring_service.Repositories.PlayableGameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for managing playable browser games (Bubble Trouble, Flappy Bird, etc.)
 * Separate from store games which handle marketplace functionality
 */
@Service
public class PlayableGameService {
    
    @Autowired
    private PlayableGameRepository playableGameRepository;
    
    // Get all playable games
    public List<PlayableGame> getAllPlayableGames() {
        return playableGameRepository.findAll();
    }
    
    // Get playable game by ID
    public Optional<PlayableGame> getPlayableGameById(Long id) {
        return playableGameRepository.findById(id);
    }
    
    // Get playable game by name
    public Optional<PlayableGame> getPlayableGameByName(String name) {
        return playableGameRepository.findByName(name);
    }
    
    // Create a new playable game
    @Transactional
    public PlayableGame createPlayableGame(String name, String description) {
        if (playableGameRepository.existsByName(name)) {
            throw new RuntimeException("Playable game with name '" + name + "' already exists");
        }
        
        PlayableGame game = PlayableGame.builder()
                .name(name)
                .description(description)
                .build();
        
        return playableGameRepository.save(game);
    }
    
    // Update playable game
    @Transactional
    public PlayableGame updatePlayableGame(Long id, String name, String description) {
        PlayableGame game = playableGameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playable game not found with ID: " + id));
        
        if (name != null && !name.equals(game.getName())) {
            if (playableGameRepository.existsByName(name)) {
                throw new RuntimeException("Playable game with name '" + name + "' already exists");
            }
            game.setName(name);
        }
        
        if (description != null) {
            game.setDescription(description);
        }
        
        return playableGameRepository.save(game);
    }
    
    // Delete playable game
    @Transactional
    public void deletePlayableGame(Long id) {
        if (!playableGameRepository.existsById(id)) {
            throw new RuntimeException("Playable game not found with ID: " + id);
        }
        playableGameRepository.deleteById(id);
    }
    
    // Check if playable game exists
    public boolean playableGameExists(String name) {
        return playableGameRepository.existsByName(name);
    }
}
