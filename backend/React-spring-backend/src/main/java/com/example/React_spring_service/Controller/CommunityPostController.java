package com.example.React_spring_service.Controller;

import com.example.React_spring_service.Entities.CommunityPost;
import com.example.React_spring_service.Entities.User;
import com.example.React_spring_service.Enum.PostType;
import com.example.React_spring_service.Repositories.CommunityPostRepository;
import com.example.React_spring_service.Repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommunityPostController {

    private final CommunityPostRepository communityPostRepository;
    private final UserRepository userRepository;

    /**
     * GET /api/community/posts/{id}
     * Returns a single post by ID or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<CommunityPost> getPostById(@PathVariable Long id) {
        return communityPostRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/community/posts/type/{type}
     * Returns all posts filtered by PostType
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<CommunityPost>> getPostsByType(@PathVariable String type) {
        try {
            PostType postType = PostType.valueOf(type.toUpperCase());
            List<CommunityPost> posts = communityPostRepository.findByTypeOrderByDateCreatedDesc(postType);
            return ResponseEntity.ok(posts);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST /api/community/posts
     * Creates a new community post
     * 
     * Request body: { "title": "...", "description": "...", "type": "...", "tags": [...], "attachments": [...] }
     * Header: X-User-Id (required to simulate logged-in user)
     * 
     * Returns 201 on success, 400 for validation errors, 401 if no user ID
     */
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody PostRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        // Validate user ID header (simulates authentication)
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "X-User-Id header is required to create a post"));
        }

        // Verify user exists
        User author = userRepository.findById(userId)
                .orElse(null);
        if (author == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        // Validate request
        if (request.title == null || request.title.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Title is required"));
        }

        if (request.type == null || request.type.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Post type is required"));
        }

        // Validate post type
        PostType postType;
        try {
            postType = PostType.valueOf(request.type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid post type. Valid types: IMAGE, VIDEO, SCREENSHOT, NEWS, FORUM_POST"));
        }

        // Create post
        CommunityPost post = CommunityPost.builder()
                .title(request.title)
                .description(request.description)
                .type(postType)
                .author(author)
                .tags(request.tags)
                .attachments(request.attachments)
                .build();

        CommunityPost savedPost = communityPostRepository.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    // Request DTO
    static class PostRequest {
        public String title;
        public String description;
        public String type;
        public List<String> tags;
        public List<String> attachments;
    }
}
