package com.example.React_spring_service.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.React_spring_service.Entities.Wishlist;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    // Check if a game is already wishlisted
    boolean existsByUserIdAndGameId(Long userId, Long gameId);

    // Get a user's full wishlist
    List<Wishlist> findByUserId(Long userId);
}