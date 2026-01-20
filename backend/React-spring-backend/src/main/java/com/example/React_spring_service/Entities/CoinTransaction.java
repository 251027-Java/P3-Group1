package com.example.React_spring_service.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "coin_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoinTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The amount: positive for EARNED (purchase), negative for SPENT (reward)
    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false)
    private String reason; // e.g., "PURCHASE: Cyber Protocol", "REDEEM: $5 Voucher"

    @Column(nullable = false)
    private LocalDateTime timestamp;

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

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}