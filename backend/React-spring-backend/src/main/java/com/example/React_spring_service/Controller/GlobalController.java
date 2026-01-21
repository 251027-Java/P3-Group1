package com.example.React_spring_service.Controller;

import com.example.React_spring_service.Entities.*;
import com.example.React_spring_service.Enum.PostType;
import com.example.React_spring_service.Repositories.CommunityPostRepository;
import com.example.React_spring_service.Repositories.UserRepository;
import com.example.React_spring_service.Services.GlobalDataService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GlobalController {

    private final GlobalDataService globalDataService;
    private final CommunityPostRepository communityPostRepository;
    private final UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        System.out.println("Did we reach this part of the controller?");
        System.out.println("Did we reach this part of the controller?");
        System.out.println("Did we reach this part of the controller?");
        System.out.println("Did we reach this part of the controller?");
        System.out.println("Did we reach this part of the controller?");
        return ResponseEntity.ok(globalDataService.getAllUsers());
    }

    // @GetMapping("/games")
    // public ResponseEntity<List<Game>> getAllGames() {
    // return ResponseEntity.ok(globalDataService.getAllGames());
    // }

    @GetMapping("/rewards")
    public ResponseEntity<List<Reward>> getAllRewards() {
        return ResponseEntity.ok(globalDataService.getAllRewards());
    }

    @GetMapping("/community/posts")
    public ResponseEntity<List<CommunityPost>> getAllPosts() {
        return ResponseEntity.ok(globalDataService.getAllCommunityPosts());
    }

    @GetMapping("/community/posts/{postId}/comments")
    public ResponseEntity<List<Comment>> getPostComments(@PathVariable Long postId) {
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

    @GetMapping("/wishlist")
    public ResponseEntity<List<Wishlist>> getAllWishlists() {
        return ResponseEntity.ok(globalDataService.getAllWishlistEntries());
    }

    @GetMapping("/community/posts/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable Long postId) {
        Optional<CommunityPost> post = communityPostRepository.findById(postId);
        if (post.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }
        return ResponseEntity.ok(post.get());
    }

    @GetMapping("/community/posts/type/{type}")
    public ResponseEntity<?> getPostsByType(@PathVariable String type) {
        try {
            PostType postType = PostType.valueOf(type.toUpperCase());
            List<CommunityPost> posts = communityPostRepository.findByTypeOrderByDateCreatedDesc(postType);
            return ResponseEntity.ok(posts);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid post type: " + type,
                            "validTypes", List.of("FORUM_POST", "IMAGE", "VIDEO", "SCREENSHOT", "NEWS")));
        }
    }

    @PostMapping("/community/posts")
    public ResponseEntity<?> createPost(
            @RequestBody PostRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "X-User-Id header is required"));
        }

        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        if (request.title == null || request.title.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Title is required"));
        }

        PostType postType;
        try {
            postType = PostType.valueOf(request.type.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid post type",
                            "validTypes", List.of("FORUM_POST", "IMAGE", "VIDEO", "SCREENSHOT", "NEWS")));
        }

        CommunityPost post = CommunityPost.builder()
                .title(request.title)
                .description(request.description)
                .type(postType)
                .author(user.get())
                .tags(request.tags)
                .attachments(request.attachments)
                .build();

        CommunityPost savedPost = communityPostRepository.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    static class PostRequest {
        public String title;
        public String description;
        public String type;
        public List<String> tags;
        public List<String> attachments;
    }
}
