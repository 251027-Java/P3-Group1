package com.example.React_spring_service.Config;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.React_spring_service.Entities.CoinTransaction;
import com.example.React_spring_service.Entities.Comment;
import com.example.React_spring_service.Entities.CommunityPost;
import com.example.React_spring_service.Entities.Game;
import com.example.React_spring_service.Entities.Review;
import com.example.React_spring_service.Entities.Reward;
import com.example.React_spring_service.Entities.User;
import com.example.React_spring_service.Enum.PostType;
import com.example.React_spring_service.Enum.RewardCategory;
import com.example.React_spring_service.Enum.UserLevel;
import com.example.React_spring_service.Repositories.CoinTransactionRepository;
import com.example.React_spring_service.Repositories.CommentRepository;
import com.example.React_spring_service.Repositories.CommunityPostRepository;
import com.example.React_spring_service.Repositories.GameRepository;
import com.example.React_spring_service.Repositories.ReviewRepository;
import com.example.React_spring_service.Repositories.RewardRepository;
import com.example.React_spring_service.Repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final GameRepository gameRepository;
        private final RewardRepository rewardRepository;
        private final CommunityPostRepository postRepository;
        private final CommentRepository commentRepository;
        private final CoinTransactionRepository transactionRepository;
        private final ReviewRepository reviewRepository;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                if (userRepository.count() > 0)
                        return; // Prevent duplicate seeding

                // 1. Create Rewards (Shop Items)
                Reward discountReward = Reward.builder()
                                .title("10% Store Discount")
                                .costInCoins(500L)
                                .category(RewardCategory.DISCOUNT)
                                .discountPercent(10.0)
                                .build();
                rewardRepository.save(discountReward);

                // 2. Create Users (A Dev and a Player)
                User dev = User.builder()
                                .displayName("Neon_Architect")
                                .displayImage("/cdn/pfp/dev1.jpg")
                                .level(UserLevel.DEVELOPER)
                                .canSell(true)
                                .enabled(true)
                                .build();

                User player = User.builder()
                                .displayName("Alpha_Tester")
                                .displayImage("/cdn/pfp/player1.jpg")
                                .level(UserLevel.USER)
                                .canSell(false)
                                .gamesInLibrary(new ArrayList<>(List.of(1L))) // Pre-owning game 1
                                .notifications(List.of(Map.of("title", "Welcome to P3!", "read", false)))
                                .enabled(true)
                                .build();

                userRepository.saveAll(List.of(dev, player));

                // 5. Create Coin Transactions (The Ledger)
                CoinTransaction tx1 = CoinTransaction.builder()
                                .user(player)
                                .amount(1000L)
                                .reason("SIGNUP_BONUS")
                                .build();
                transactionRepository.save(tx1);

                // 6. Create Community Content
                CommunityPost post = CommunityPost.builder()
                                .title("How to beat Level 5?")
                                .description("I keep getting stuck at the laser grid.")
                                .type(PostType.FORUM_POST)
                                .author(player)
                                .tags(List.of("help", "cyber-protocol"))
                                .attachments(List.of("/cdn/screenshots/stuck.jpg"))
                                .build();
                postRepository.save(post);

                // 7. Create Threaded Comments
                Comment mainComment = Comment.builder()
                                .text("You have to time the dash with the blue flicker!")
                                .author(dev)
                                .post(post)
                                .build();
                commentRepository.save(mainComment);

                Comment reply = Comment.builder()
                                .text("Thanks! That worked perfectly.")
                                .author(player)
                                .post(post)
                                .parentComment(mainComment)
                                .build();
                commentRepository.save(reply);

                System.out.println(">>> DATABASE SEEDED SUCCESSFULLY WITH ALL ENTITIES <<<");
        }
}