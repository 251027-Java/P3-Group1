package com.example.React_spring_service.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "reviews", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "game_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The rating given (e.g., 1 to 5)
    @Column(nullable = false)
    private Integer ratingNumber;

    @Column(columnDefinition = "TEXT")
    private String content; // The actual text of the review

    @Builder.Default
    private Integer likes = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // --- RELATIONSHIPS ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler",
            "communityPosts",
            "notifications",
            "friends",
            "wishlist"
    })
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "dateReleased",
            "size",
            "price",
            "salePercent",
            "onSale",
            "developerLogs",
            "rewards",
            "reviews"

    })
    private Game game;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}