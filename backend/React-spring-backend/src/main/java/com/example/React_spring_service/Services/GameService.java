package com.example.React_spring_service.Services;

import com.example.React_spring_service.Entities.GameEntity;
import com.example.React_spring_service.Repositories.GameEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {
    
    @Autowired
    private GameEntityRepository gameEntityRepository;
    
    // Get all games
    public List<GameEntity> getAllGames() {
        return gameEntityRepository.findAll();
    }
    
    // Get game by ID
    public Optional<GameEntity> getGameById(Long id) {
        return gameEntityRepository.findById(id);
    }
    
    // Get game by name
    public Optional<GameEntity> getGameByName(String name) {
        return gameEntityRepository.findByName(name);
    }
    
    // Create a new game
    @Transactional
    public GameEntity createGame(String name, String description) {
        GameEntity game = GameEntity.builder()
                .name(name)
                .description(description)
                .build();
        
        return gameEntityRepository.save(game);
    }
    
    // Update game
    @Transactional
    public GameEntity updateGame(Long id, String name, String description) {
        GameEntity game = gameEntityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        
        if (name != null) {
            game.setName(name);
        }
        if (description != null) {
            game.setDescription(description);
        }
        
        return gameEntityRepository.save(game);
    }
    
    // Delete game
    @Transactional
    public void deleteGame(Long id) {
        gameEntityRepository.deleteById(id);
    }
    
    // Check if game exists
    public boolean gameExists(String name) {
        return gameEntityRepository.existsByName(name);
    }
}
