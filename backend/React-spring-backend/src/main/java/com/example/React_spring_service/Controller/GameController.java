package com.example.React_spring_service.Controller;

import com.example.React_spring_service.Entities.Game;
import com.example.React_spring_service.Entities.Review;
import com.example.React_spring_service.Entities.User;
import com.example.React_spring_service.Repositories.GameRepository;
import com.example.React_spring_service.Repositories.ReviewRepository;
import com.example.React_spring_service.Repositories.UserRepository;

import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameController {

    private final GameRepository gameRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    /**
     * GET /api/games/{id}
     * Returns a single game by ID or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable Long id) {
        return gameRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/games/{id}/reviews
     * Returns all reviews for a specific game, ordered by creation date (newest first)
     */
    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> getReviewsByGameId(@PathVariable Long id) {
        // Verify game exists
        if (!gameRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        List<Review> reviews = reviewRepository.findByGameIdOrderByCreatedAtDesc(id);
        return ResponseEntity.ok(reviews);
    }

    /**
     * POST /api/games/{id}/reviews
     * Creates a new review for a game
     * 
     * Enforces "one review per user per game" rule using X-User-Id header
     * 
     * Request body: { "ratingNumber": 1-5, "content": "review text" }
     * Header: X-User-Id (required to simulate logged-in user)
     * 
     * Returns 201 on success, 400 for validation errors, 401 if no user ID, 409 if review already exists
     */
    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> createReview(
            @PathVariable Long id,
            @RequestBody ReviewRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        // Validate user ID header (simulates authentication)
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "X-User-Id header is required to post a review"));
        }

        // Verify game exists
        Game game = gameRepository.findById(id)
                .orElse(null);
        if (game == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found"));
        }

        // Verify user exists
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        // Validate rating (1-5)
        if (request.getRatingNumber() == null || request.getRatingNumber() < 1 || request.getRatingNumber() > 5) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Rating must be between 1 and 5"));
        }

        // Validate content is not empty
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Review content cannot be empty"));
        }

        // Check if user already reviewed this game (one review per user per game)
        if (reviewRepository.existsByUserIdAndGameId(userId, id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "You have already reviewed this game"));
        }

        // Create and save the review
        Review review = Review.builder()
                .ratingNumber(request.getRatingNumber())
                .content(request.getContent().trim())
                .user(user)
                .game(game)
                .build();

        Review savedReview = reviewRepository.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    /**
     * DTO for review creation request
     */
    @lombok.Data
    public static class ReviewRequest {
        private Integer ratingNumber;
        private String content;
    }
}
