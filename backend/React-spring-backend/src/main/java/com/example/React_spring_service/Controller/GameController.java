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

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
// @CrossOrigin(origins = "*")
@Slf4j
public class GameController {

    private final GameRepository gameRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    /**
     * GET /api/games
     * Returns a list of all games
     */
    @GetMapping
    public ResponseEntity<List<Game>> getAllGames() {
        log.info("getting all games");
        List<Game> games = gameRepository.findAll();
        return ResponseEntity.ok(games);
    }

    /**
     * GET /api/games/{id}
     * Returns a single game by ID or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable Long id) {
        log.info("getting game by id: " + id);
        return gameRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/games/{id}/reviews
     * Returns all reviews for a specific game, ordered by creation date (newest
     * first)
     */
    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> getReviewsByGameId(@PathVariable Long id) {
        // Verify game exists
        log.info("getting reviews for game id: " + id);
        if (!gameRepository.existsById(id)) {
            log.debug("reviews requested for non-existent game id: " + id);
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
     * Returns 201 on success, 400 for validation errors, 401 if no user ID, 409 if
     * review already exists
     */
    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> createReview(
            @PathVariable Long id,
            @RequestBody ReviewRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {

        log.info("Creating review for game ID: " + id + " by user ID: " + userId);

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
