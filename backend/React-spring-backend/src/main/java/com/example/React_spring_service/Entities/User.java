package com.example.React_spring_service.Entities;

import jakarta.persistence.*;
import lombok.*;

import com.example.React_spring_service.Config.JsonConverter;

import com.example.React_spring_service.Enum.UserLevel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.*;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// ADD THIS: To prevent the "ByteBuddyInterceptor" error we saw earlier
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String displayName;

    private String displayImage;

    @Enumerated(EnumType.STRING)
    private UserLevel level;

    private boolean canSell;

    // --- RELATIONAL (MANY-TO-MANY) ---
    @ManyToMany
    @JoinTable(name = "user_rewards", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "reward_id"))
    @JsonIgnoreProperties("users") // Prevent rewards from listing users back
    private Set<Reward> rewards = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "user_friends", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "friend_id"))
    @JsonIgnoreProperties({ "friends", "communityPosts", "rewards" }) // Crucial: Stop the friend-of-a-friend loop
    private Set<User> friends = new HashSet<>();

    // --- JSONB (ID LISTS & METADATA) ---

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.class)
    @Builder.Default
    // FIX 1: Use Number to handle both Integer (from DB) and Long (intended)
    // FIX 2: Add @JsonIgnore so a "Game" request doesn't leak the whole library
    @JsonIgnore
    private List<Number> gamesInLibrary = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.class)
    @Builder.Default
    @JsonIgnore
    private List<Long> wishlist = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.class)
    @Builder.Default
    private List<Map<String, Object>> notifications = new ArrayList<>();

    // --- RELATIONSHIPS (ONE-TO-MANY) ---

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonIgnore // Stop the loop: User -> Post -> Author -> User
    private List<CommunityPost> communityPosts = new ArrayList<>();
}