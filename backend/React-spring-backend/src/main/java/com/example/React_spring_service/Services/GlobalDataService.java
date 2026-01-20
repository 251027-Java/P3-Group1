package com.example.React_spring_service.Services;

import com.example.React_spring_service.Entities.*;
import com.example.React_spring_service.Repositories.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Optimizes performance for read operations
public class GlobalDataService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final RewardRepository rewardRepository;
    private final CommunityPostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CoinTransactionRepository transactionRepository;
    private final ReviewRepository reviewRepository;
    private final WishlistRepository wishlistRepository;

    // --- USER DATA ---
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // --- GAME & STORE DATA ---
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public List<Reward> getAllRewards() {
        return rewardRepository.findAll();
    }

    public List<Wishlist> getAllWishlistEntries() {
        return wishlistRepository.findAll();
    }

    // --- SOCIAL & FEEDBACK DATA ---
    public List<CommunityPost> getAllCommunityPosts() {
        // We use the repository to ensure they come back newest first
        return postRepository.findAll();
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    /**
     * Note: We usually don't "Get All" comments because it would be
     * a massive unstructured list. We usually fetch by Post ID.
     */
    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostIdAndParentCommentIsNullOrderByDateCreatedAsc(postId);
    }

    // --- ECONOMY DATA ---
    public List<CoinTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
