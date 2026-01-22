package com.example.React_spring_service.Controller;

import com.example.React_spring_service.DTO.GameScoreDTO;
import com.example.React_spring_service.DTO.LeaderboardEntryDTO;
import com.example.React_spring_service.Entities.GameScore;
import com.example.React_spring_service.Services.GameScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game-scores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameScoreController {

    private final GameScoreService gameScoreService;

    /**
     * Submit a new game score
     * POST /api/game-scores
     * Body: {"userId": 1, "gameId": 1, "score": 1000, "level": 5}
     */
    @PostMapping
    public ResponseEntity<GameScore> submitScore(@RequestBody GameScoreDTO scoreDTO) {
        try {
            GameScore savedScore = gameScoreService.submitScore(scoreDTO);
            return new ResponseEntity<>(savedScore, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get leaderboard for a specific game
     * GET /api/game-scores/leaderboard/{gameId}?limit=10
     */
    @GetMapping("/leaderboard/{gameId}")
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard(
            @PathVariable Long gameId,
            @RequestParam(defaultValue = "10") int limit) {
        List<LeaderboardEntryDTO> leaderboard = gameScoreService.getLeaderboard(gameId, limit);
        return ResponseEntity.ok(leaderboard);
    }

    /**
     * Get user's best score for a game
     * GET /api/game-scores/user/{userId}/game/{gameId}/best
     */
    @GetMapping("/user/{userId}/game/{gameId}/best")
    public ResponseEntity<GameScore> getUserBestScore(
            @PathVariable Long userId,
            @PathVariable Long gameId) {
        return gameScoreService.getUserBestScore(userId, gameId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all scores for a user in a specific game
     * GET /api/game-scores/user/{userId}/game/{gameId}
     */
    @GetMapping("/user/{userId}/game/{gameId}")
    public ResponseEntity<List<GameScore>> getUserGameScores(
            @PathVariable Long userId,
            @PathVariable Long gameId) {
        List<GameScore> scores = gameScoreService.getUserGameScores(userId, gameId);
        return ResponseEntity.ok(scores);
    }

    /**
     * Get all scores for a user across all games
     * GET /api/game-scores/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GameScore>> getUserAllScores(@PathVariable Long userId) {
        List<GameScore> scores = gameScoreService.getUserAllScores(userId);
        return ResponseEntity.ok(scores);
    }

    /**
     * Get all scores for a specific game
     * GET /api/game-scores/game/{gameId}
     */
    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<GameScore>> getGameScores(@PathVariable Long gameId) {
        List<GameScore> scores = gameScoreService.getScoresByGame(gameId);
        return ResponseEntity.ok(scores);
    }

    /**
     * Delete a score (admin only - add security as needed)
     * DELETE /api/game-scores/{scoreId}
     */
    @DeleteMapping("/{scoreId}")
    public ResponseEntity<Void> deleteScore(@PathVariable Long scoreId) {
        try {
            gameScoreService.deleteScore(scoreId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
