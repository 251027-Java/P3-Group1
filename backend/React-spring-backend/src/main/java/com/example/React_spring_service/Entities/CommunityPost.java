package com.example.React_spring_service.Entities;

import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.Convert;
import jakarta.persistence.Lob;
import com.example.React_spring_service.Config.JsonConverter;

import com.example.React_spring_service.Enum.PostType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "community_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostType type;

    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @Builder.Default
    private Integer likes = 0;

    // --- RELATIONSHIPS ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler",
            "communityPosts",
            "notifications",
            "friends",
            "wishlist"
    })
    private User author;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnoreProperties("post")
    private List<Comment> comments = new ArrayList<>();

    // --- JSONB FOR FLEXIBILITY ---

    @Lob
    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.class)
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Lob
    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.class)
    @Builder.Default
    private List<String> attachments = new ArrayList<>(); // URLs to images, videos, or screenshots

    @PrePersist
    protected void onCreate() {
        this.dateCreated = LocalDateTime.now();
    }
}