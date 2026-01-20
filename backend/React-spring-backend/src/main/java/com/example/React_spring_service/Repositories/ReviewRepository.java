package com.example.React_spring_service.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.React_spring_service.Entities.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Find all reviews for a specific game
    List<Review> findByGameIdOrderByCreatedAtDesc(Long gameId);

    // Check if a user has already reviewed this game (for your Unique Constraint)
    boolean existsByUserIdAndGameId(Long userId, Long gameId);
}