package com.example.React_spring_service.Config;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
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
                boolean skipSeeding = false;
                if (skipSeeding)
                        return;

                if (userRepository.count() > 0) {
                        System.out.println(">>> DATABASE ALREADY CONTAINS DATA, SKIPPING SEEDING <<<");
                        return;
                }

                // 1. Create Rewards (Shop Items)
                Reward discountReward = Reward.builder()
                                .title("10% Store Discount")
                                .costInCoins(500L)
                                .category(RewardCategory.DISCOUNT)
                                .discountPercent(10.0)
                                .build();
                rewardRepository.save(discountReward);

                // 2. Create Users
                // NOTE: We initialize 'friends' as a new HashSet to avoid NullPointerException
                User dev = User.builder()
                                .displayName("Neon_Architect")
                                .displayImage("/cdn/pfp/dev1.jpg")
                                .level(UserLevel.DEVELOPER)
                                .canSell(true)
                                .friends(new HashSet<>())
                                .build();

                User player = User.builder()
                                .displayName("Alpha_Tester")
                                .displayImage("/cdn/pfp/player1.jpg")
                                .level(UserLevel.USER)
                                .canSell(false)
                                .friends(new HashSet<>())
                                .gamesInLibrary(new ArrayList<>(List.of(1L)))
                                .notifications(List.of(Map.of("title", "Welcome to P3!", "read", false)))
                                .build();

                // PERSIST users first to generate IDs before creating relationships
                userRepository.saveAll(List.of(dev, player));

                // Create friendship between dev and player
                dev.getFriends().add(player);
                player.getFriends().add(dev);

                // Save again to update the join table
                userRepository.saveAll(List.of(dev, player));

                // 3. Create a Game
                Game webGame = Game.builder()
                                .name("Cyber Protocol")
                                .developer("Neon_Architect")
                                .publisher("Fleet Games")
                                .dateReleased(LocalDate.now())
                                .tags(List.of("Cyberpunk", "WebGL", "Hardcore"))
                                .developerLogs(List.of(Map.of("title", "Version 1.0 Live", "description",
                                                "Initial web build launch")))
                                .rewards(List.of(Map.of("id", 1, "title", "Neon Skin", "cost", 100)))
                                .build();
                gameRepository.save(webGame);

                // 4. Create a Review
                Review review = Review.builder()
                                .ratingNumber(5)
                                .content("Best browser game I've played this year!")
                                .likes(12)
                                .user(player)
                                .game(webGame)
                                .build();
                reviewRepository.save(review);

                // 5. Create Coin Transactions
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