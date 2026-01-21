package com.example.React_spring_service.Controller;

import com.example.React_spring_service.Entities.*;
import com.example.React_spring_service.Services.GlobalDataService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GlobalDataController {

    private final GlobalDataService globalDataService;

    @GetMapping("/games")
    public ResponseEntity<List<Game>> getAllGames() {
        return ResponseEntity.ok(globalDataService.getAllGames());
    }

    @GetMapping("/rewards")
    public ResponseEntity<List<Reward>> getAllRewards() {
        return ResponseEntity.ok(globalDataService.getAllRewards());
    }

    @GetMapping("/posts")
    public ResponseEntity<List<CommunityPost>> getAllPosts() {
        return ResponseEntity.ok(globalDataService.getAllCommunityPosts());
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(globalDataService.getCommentsByPost(postId));
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(globalDataService.getAllReviews());
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<CoinTransaction>> getAllTransactions() {
        return ResponseEntity.ok(globalDataService.getAllTransactions());
    }

    @GetMapping("/wishlists")
    public ResponseEntity<List<Wishlist>> getAllWishlists() {
        return ResponseEntity.ok(globalDataService.getAllWishlistEntries());
    }
}
