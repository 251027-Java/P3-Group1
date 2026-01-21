package com.example.React_spring_service.Controller;

import com.example.React_spring_service.Entities.PlayableGame;
import com.example.React_spring_service.Services.PlayableGameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for managing playable browser games (Bubble Trouble, Flappy Bird, etc.)
 * Separate from store games which handle marketplace functionality
 */
@RestController
@RequestMapping("/api/playable-games")
@CrossOrigin(origins = "*")
public class PlayableGameController {
    
    @Autowired
    private PlayableGameService playableGameService;
    
    /**
     * Get all playable games
     * GET /api/playable-games
     */
    @GetMapping
    public ResponseEntity<List<PlayableGame>> getAllPlayableGames() {
        List<PlayableGame> games = playableGameService.getAllPlayableGames();
        return ResponseEntity.ok(games);
    }
    
    /**
     * Get playable game by ID
     * GET /api/playable-games/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<PlayableGame> getPlayableGameById(@PathVariable Long id) {
        return playableGameService.getPlayableGameById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get playable game by name
     * GET /api/playable-games/name/{name}
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<PlayableGame> getPlayableGameByName(@PathVariable String name) {
        return playableGameService.getPlayableGameByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Create a new playable game
     * POST /api/playable-games
     * Body: {"name": "Bubble Trouble", "description": "Pop bubbles game"}
     */
    @PostMapping
    public ResponseEntity<PlayableGame> createPlayableGame(@RequestBody Map<String, String> gameData) {
        try {
            String name = gameData.get("name");
            String description = gameData.get("description");
            
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            PlayableGame game = playableGameService.createPlayableGame(name, description);
            return ResponseEntity.status(HttpStatus.CREATED).body(game);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Update playable game
     * PUT /api/playable-games/{id}
     * Body: {"name": "Updated Name", "description": "Updated description"}
     */
    @PutMapping("/{id}")
    public ResponseEntity<PlayableGame> updatePlayableGame(
            @PathVariable Long id,
            @RequestBody Map<String, String> gameData) {
        try {
            String name = gameData.get("name");
            String description = gameData.get("description");
            
            PlayableGame game = playableGameService.updatePlayableGame(id, name, description);
            return ResponseEntity.ok(game);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Delete playable game
     * DELETE /api/playable-games/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayableGame(@PathVariable Long id) {
        try {
            playableGameService.deletePlayableGame(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
