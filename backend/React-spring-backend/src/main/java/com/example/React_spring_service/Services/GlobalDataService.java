package com.example.React_spring_service.Services;

import com.example.React_spring_service.Entities.*;
import com.example.React_spring_service.Repositories.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GlobalDataService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final RewardRepository rewardRepository;
    private final CommunityPostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CoinTransactionRepository transactionRepository;
    private final ReviewRepository reviewRepository;
    private final WishlistRepository wishlistRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public List<Reward> getAllRewards() {
        return rewardRepository.findAll();
    }

    public List<Wishlist> getAllWishlistEntries() {
        return wishlistRepository.findAll();
    }

    public List<CommunityPost> getAllCommunityPosts() {
        return postRepository.findAll();
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostIdAndParentCommentIsNullOrderByDateCreatedAsc(postId);
    }

    public List<CoinTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
