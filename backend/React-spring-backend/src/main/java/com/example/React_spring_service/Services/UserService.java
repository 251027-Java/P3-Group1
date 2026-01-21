package com.example.React_spring_service.Services;

import com.example.React_spring_service.Entities.*;
import com.example.React_spring_service.Repositories.*;
import com.example.React_spring_service.Enum.UserLevel;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RewardRepository rewardRepository;
    private final GameRepository gameRepository;

    // ==================== USER PROFILE OPERATIONS ====================

    /**
     * Get user by ID with all profile information
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    /**
     * Get user by display name
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserByDisplayName(String displayName) {
        return userRepository.findByDisplayName(displayName);
    }

    /**
     * Update user profile information
     */
    public User updateUserProfile(Long userId, String displayName, String displayImage, UserLevel level,
            Boolean canSell) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (displayName != null && !displayName.trim().isEmpty()) {
            user.setDisplayName(displayName);
        }
        if (displayImage != null) {
            user.setDisplayImage(displayImage);
        }
        if (level != null) {
            user.setLevel(level);
        }
        if (canSell != null) {
            user.setCanSell(canSell);
        }

        return userRepository.save(user);
    }

    // ==================== FRIENDS MANAGEMENT ====================

    /**
     * Get all friends of a user
     */
    @Transactional(readOnly = true)
    public Set<User> getUserFriends(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getFriends();
    }

    /**
     * Add a friend
     */
    public User addFriend(Long userId, Long friendId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend not found with id: " + friendId));

        user.getFriends().add(friend);
        return userRepository.save(user);
    }

    /**
     * Remove a friend
     */
    public User removeFriend(Long userId, Long friendId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.getFriends().removeIf(friend -> friend.getId().equals(friendId));
        return userRepository.save(user);
    }

    // ==================== GAMES LIBRARY MANAGEMENT ====================

    /**
     * Get user's games library
     */
    @Transactional(readOnly = true)
    public List<Long> getUserGamesLibrary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getGamesInLibrary().stream()
                .map(num -> (Long) num) // Force cast to Long
                .toList();
    }

    /**
     * Add game to user's library
     */
    public User addGameToLibrary(Long userId, Long gameId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Verify game exists
        gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found with id: " + gameId));

        if (!user.getGamesInLibrary().contains(gameId)) {

            ((List) user.getGamesInLibrary()).add(gameId);
        }
        return userRepository.save(user);
    }

    /**
     * Remove game from user's library
     */
    public User removeGameFromLibrary(Long userId, Long gameId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.getGamesInLibrary().remove(gameId);
        return userRepository.save(user);
    }

    /**
     * Get full Game objects from user's library
     */
    @Transactional(readOnly = true)
    public List<Game> getUserGamesLibraryFull(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return user.getGamesInLibrary().stream()
                // 1. Explicitly cast the 'Number' capture to 'Long'
                .map(gameId -> (Long) gameId)
                // 2. Now the repository will accept the Long
                .map(gameId -> gameRepository.findById(gameId).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // ==================== WISHLIST MANAGEMENT ====================

    /**
     * Get user's wishlist
     */
    @Transactional(readOnly = true)
    public List<Long> getUserWishlist(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return ((List) user.getWishlist());
    }

    /**
     * Add game to wishlist
     */
    public User addGameToWishlist(Long userId, Long gameId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Verify game exists
        gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found with id: " + gameId));

        if (!user.getWishlist().contains(gameId)) {
            ((List) user.getWishlist()).add(gameId);
        }
        return userRepository.save(user);
    }

    /**
     * Remove game from wishlist
     */
    public User removeGameFromWishlist(Long userId, Long gameId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.getWishlist().remove(gameId);
        return userRepository.save(user);
    }

    /**
     * Get full Game objects from user's wishlist
     */
    @Transactional(readOnly = true)
    public List<Game> getUserWishlistFull(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return user.getWishlist().stream()
                // Map the '? extends Number' to 'Long' explicitly
                .map(num -> (Long) num)
                // Now you can safely pass it to the repository
                .map(gameId -> gameRepository.findById(gameId).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // ==================== REWARDS MANAGEMENT ====================

    /**
     * Get user's rewards
     */
    @Transactional(readOnly = true)
    public Set<Reward> getUserRewards(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getRewards();
    }

    /**
     * Add reward to user
     */
    public User addRewardToUser(Long userId, Long rewardId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new RuntimeException("Reward not found with id: " + rewardId));

        user.getRewards().add(reward);
        return userRepository.save(user);
    }

    /**
     * Remove reward from user
     */
    public User removeRewardFromUser(Long userId, Long rewardId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.getRewards().removeIf(reward -> reward.getId().equals(rewardId));
        return userRepository.save(user);
    }

    // ==================== NOTIFICATIONS MANAGEMENT ====================

    /**
     * Get user's notifications
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUserNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getNotifications();
    }

    /**
     * Add notification to user
     */
    public User addNotification(Long userId, Map<String, Object> notification) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.getNotifications().add(notification);
        return userRepository.save(user);
    }

    /**
     * Clear all notifications for a user
     */
    public User clearNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.getNotifications().clear();
        return userRepository.save(user);
    }

    /**
     * Remove specific notification by index
     */
    public User removeNotification(Long userId, int notificationIndex) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (notificationIndex >= 0 && notificationIndex < user.getNotifications().size()) {
            user.getNotifications().remove(notificationIndex);
        }
        return userRepository.save(user);
    }

    // ==================== COMMUNITY POSTS ====================

    /**
     * Get user's community posts
     */
    @Transactional(readOnly = true)
    public List<CommunityPost> getUserCommunityPosts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getCommunityPosts();
    }

    // ==================== USER STATISTICS ====================

    /**
     * Get user profile statistics
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getUserStatistics(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Map<String, Object> stats = new HashMap<>();
        stats.put("userId", user.getId());
        stats.put("displayName", user.getDisplayName());
        stats.put("level", user.getLevel());
        stats.put("canSell", user.isCanSell());
        stats.put("totalGames", user.getGamesInLibrary().size());
        stats.put("totalWishlist", user.getWishlist().size());
        stats.put("totalFriends", user.getFriends().size());
        stats.put("totalRewards", user.getRewards().size());
        stats.put("totalPosts", user.getCommunityPosts().size());
        stats.put("unreadNotifications", user.getNotifications().size());

        return stats;
    }
}
