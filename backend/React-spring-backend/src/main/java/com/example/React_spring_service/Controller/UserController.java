package com.example.React_spring_service.Controller;

import com.example.React_spring_service.Entities.*;
import com.example.React_spring_service.Services.UserService;
import com.example.React_spring_service.Enum.UserLevel;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    // ==================== USER PROFILE ENDPOINTS ====================

    /**
     * GET /api/users/{id}
     * Get user profile by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> user = userService.getUserById(id);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with id: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/users/displayName/{displayName}
     * Get user by display name
     */
    @GetMapping("/displayName/{displayName}")
    public ResponseEntity<?> getUserByDisplayName(@PathVariable String displayName) {
        try {
            Optional<User> user = userService.getUserByDisplayName(displayName);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with display name: " + displayName));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PUT /api/users/{id}/profile
     * Update user profile
     * Request body: {displayName, displayImage, level, canSell}
     */
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            String displayName = (String) updates.get("displayName");
            String displayImage = (String) updates.get("displayImage");
            UserLevel level = updates.containsKey("level") 
                    ? UserLevel.valueOf((String) updates.get("level")) 
                    : null;
            Boolean canSell = updates.containsKey("canSell") 
                    ? (Boolean) updates.get("canSell") 
                    : null;

            User updatedUser = userService.updateUserProfile(id, displayName, displayImage, level, canSell);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid request: " + e.getMessage()));
        }
    }

    /**
     * GET /api/users/{id}/statistics
     * Get user statistics
     */
    @GetMapping("/{id}/statistics")
    public ResponseEntity<?> getUserStatistics(@PathVariable Long id) {
        try {
            Map<String, Object> stats = userService.getUserStatistics(id);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== FRIENDS ENDPOINTS ====================

    /**
     * GET /api/users/{id}/friends
     * Get user's friends
     */
    @GetMapping("/{id}/friends")
    public ResponseEntity<?> getUserFriends(@PathVariable Long id) {
        try {
            Set<User> friends = userService.getUserFriends(id);
            return ResponseEntity.ok(friends);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/users/{id}/friends/{friendId}
     * Add a friend
     */
    @PostMapping("/{id}/friends/{friendId}")
    public ResponseEntity<?> addFriend(
            @PathVariable Long id,
            @PathVariable Long friendId) {
        try {
            User user = userService.addFriend(id, friendId);
            return ResponseEntity.ok(Map.of(
                    "message", "Friend added successfully",
                    "user", user
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/users/{id}/friends/{friendId}
     * Remove a friend
     */
    @DeleteMapping("/{id}/friends/{friendId}")
    public ResponseEntity<?> removeFriend(
            @PathVariable Long id,
            @PathVariable Long friendId) {
        try {
            User user = userService.removeFriend(id, friendId);
            return ResponseEntity.ok(Map.of(
                    "message", "Friend removed successfully",
                    "user", user
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== GAMES LIBRARY ENDPOINTS ====================

    /**
     * GET /api/users/{id}/library
     * Get user's games library (IDs only)
     */
    @GetMapping("/{id}/library")
    public ResponseEntity<?> getUserLibrary(@PathVariable Long id) {
        try {
            List<Long> library = userService.getUserGamesLibrary(id);
            return ResponseEntity.ok(library);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/users/{id}/library/full
     * Get user's games library (full Game objects)
     */
    @GetMapping("/{id}/library/full")
    public ResponseEntity<?> getUserLibraryFull(@PathVariable Long id) {
        try {
            List<Game> games = userService.getUserGamesLibraryFull(id);
            return ResponseEntity.ok(games);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/users/{id}/library/{gameId}
     * Add game to library
     */
    @PostMapping("/{id}/library/{gameId}")
    public ResponseEntity<?> addGameToLibrary(
            @PathVariable Long id,
            @PathVariable Long gameId) {
        try {
            User user = userService.addGameToLibrary(id, gameId);
            return ResponseEntity.ok(Map.of(
                    "message", "Game added to library successfully",
                    "library", user.getGamesInLibrary()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/users/{id}/library/{gameId}
     * Remove game from library
     */
    @DeleteMapping("/{id}/library/{gameId}")
    public ResponseEntity<?> removeGameFromLibrary(
            @PathVariable Long id,
            @PathVariable Long gameId) {
        try {
            User user = userService.removeGameFromLibrary(id, gameId);
            return ResponseEntity.ok(Map.of(
                    "message", "Game removed from library successfully",
                    "library", user.getGamesInLibrary()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== WISHLIST ENDPOINTS ====================

    /**
     * GET /api/users/{id}/wishlist
     * Get user's wishlist (IDs only)
     */
    @GetMapping("/{id}/wishlist")
    public ResponseEntity<?> getUserWishlist(@PathVariable Long id) {
        try {
            List<Long> wishlist = userService.getUserWishlist(id);
            return ResponseEntity.ok(wishlist);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/users/{id}/wishlist/full
     * Get user's wishlist (full Game objects)
     */
    @GetMapping("/{id}/wishlist/full")
    public ResponseEntity<?> getUserWishlistFull(@PathVariable Long id) {
        try {
            List<Game> games = userService.getUserWishlistFull(id);
            return ResponseEntity.ok(games);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/users/{id}/wishlist/{gameId}
     * Add game to wishlist
     */
    @PostMapping("/{id}/wishlist/{gameId}")
    public ResponseEntity<?> addGameToWishlist(
            @PathVariable Long id,
            @PathVariable Long gameId) {
        try {
            User user = userService.addGameToWishlist(id, gameId);
            return ResponseEntity.ok(Map.of(
                    "message", "Game added to wishlist successfully",
                    "wishlist", user.getWishlist()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/users/{id}/wishlist/{gameId}
     * Remove game from wishlist
     */
    @DeleteMapping("/{id}/wishlist/{gameId}")
    public ResponseEntity<?> removeGameFromWishlist(
            @PathVariable Long id,
            @PathVariable Long gameId) {
        try {
            User user = userService.removeGameFromWishlist(id, gameId);
            return ResponseEntity.ok(Map.of(
                    "message", "Game removed from wishlist successfully",
                    "wishlist", user.getWishlist()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== REWARDS ENDPOINTS ====================

    /**
     * GET /api/users/{id}/rewards
     * Get user's rewards
     */
    @GetMapping("/{id}/rewards")
    public ResponseEntity<?> getUserRewards(@PathVariable Long id) {
        try {
            Set<Reward> rewards = userService.getUserRewards(id);
            return ResponseEntity.ok(rewards);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/users/{id}/rewards/{rewardId}
     * Add reward to user
     */
    @PostMapping("/{id}/rewards/{rewardId}")
    public ResponseEntity<?> addRewardToUser(
            @PathVariable Long id,
            @PathVariable Long rewardId) {
        try {
            User user = userService.addRewardToUser(id, rewardId);
            return ResponseEntity.ok(Map.of(
                    "message", "Reward added successfully",
                    "rewards", user.getRewards()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/users/{id}/rewards/{rewardId}
     * Remove reward from user
     */
    @DeleteMapping("/{id}/rewards/{rewardId}")
    public ResponseEntity<?> removeRewardFromUser(
            @PathVariable Long id,
            @PathVariable Long rewardId) {
        try {
            User user = userService.removeRewardFromUser(id, rewardId);
            return ResponseEntity.ok(Map.of(
                    "message", "Reward removed successfully",
                    "rewards", user.getRewards()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== NOTIFICATIONS ENDPOINTS ====================

    /**
     * GET /api/users/{id}/notifications
     * Get user's notifications
     */
    @GetMapping("/{id}/notifications")
    public ResponseEntity<?> getUserNotifications(@PathVariable Long id) {
        try {
            List<Map<String, Object>> notifications = userService.getUserNotifications(id);
            return ResponseEntity.ok(notifications);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/users/{id}/notifications
     * Add notification to user
     * Request body: notification object as Map
     */
    @PostMapping("/{id}/notifications")
    public ResponseEntity<?> addNotification(
            @PathVariable Long id,
            @RequestBody Map<String, Object> notification) {
        try {
            User user = userService.addNotification(id, notification);
            return ResponseEntity.ok(Map.of(
                    "message", "Notification added successfully",
                    "notifications", user.getNotifications()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/users/{id}/notifications
     * Clear all notifications
     */
    @DeleteMapping("/{id}/notifications")
    public ResponseEntity<?> clearNotifications(@PathVariable Long id) {
        try {
            userService.clearNotifications(id);
            return ResponseEntity.ok(Map.of(
                    "message", "All notifications cleared successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/users/{id}/notifications/{index}
     * Remove specific notification by index
     */
    @DeleteMapping("/{id}/notifications/{index}")
    public ResponseEntity<?> removeNotification(
            @PathVariable Long id,
            @PathVariable int index) {
        try {
            User user = userService.removeNotification(id, index);
            return ResponseEntity.ok(Map.of(
                    "message", "Notification removed successfully",
                    "notifications", user.getNotifications()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== COMMUNITY POSTS ENDPOINTS ====================

    /**
     * GET /api/users/{id}/posts
     * Get user's community posts
     */
    @GetMapping("/{id}/posts")
    public ResponseEntity<?> getUserPosts(@PathVariable Long id) {
        try {
            List<CommunityPost> posts = userService.getUserCommunityPosts(id);
            return ResponseEntity.ok(posts);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
