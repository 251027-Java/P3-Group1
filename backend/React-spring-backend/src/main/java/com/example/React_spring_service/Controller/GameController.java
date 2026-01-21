package com.example.React_spring_service.Controller;

import com.example.React_spring_service.Entities.GameEntity;
import com.example.React_spring_service.Services.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*")
public class GameController {
    
    @Autowired
    private GameService gameService;
    
    // Get all games
    @GetMapping
    public ResponseEntity<List<GameEntity>> getAllGames() {
        List<GameEntity> games = gameService.getAllGames();
        return ResponseEntity.ok(games);
    }
    
    // Get game by ID
    @GetMapping("/{id}")
    public ResponseEntity<GameEntity> getGameById(@PathVariable Long id) {
        return gameService.getGameById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Get game by name
    @GetMapping("/name/{name}")
    public ResponseEntity<GameEntity> getGameByName(@PathVariable String name) {
        return gameService.getGameByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create a new game
    @PostMapping
    public ResponseEntity<GameEntity> createGame(@RequestBody Map<String, String> gameData) {
        try {
            String name = gameData.get("name");
            String description = gameData.get("description");
            
            GameEntity game = gameService.createGame(name, description);
            return ResponseEntity.status(HttpStatus.CREATED).body(game);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // Update game
    @PutMapping("/{id}")
    public ResponseEntity<GameEntity> updateGame(
            @PathVariable Long id,
            @RequestBody Map<String, String> gameData) {
        try {
            String name = gameData.get("name");
            String description = gameData.get("description");
            
            GameEntity game = gameService.updateGame(id, name, description);
            return ResponseEntity.ok(game);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete game
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        try {
            gameService.deleteGame(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
