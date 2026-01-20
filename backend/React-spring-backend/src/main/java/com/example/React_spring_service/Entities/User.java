package com.example.React_spring_service.Entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.example.React_spring_service.Enum.UserLevel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // Allows for User.builder().displayName("Dev").build()
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String displayName;

    private String displayImage; // Path to storage directory

    @Enumerated(EnumType.STRING)
    private UserLevel level; // Enum: DEVELOPER, USER

    private boolean canSell;

    // --- RELATIONAL (MANY-TO-MANY) ---
    // Best practice: Use Set for ManyToMany to avoid duplicate entries

    @ManyToMany
    @JoinTable(name = "user_rewards", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "reward_id"))
    private Set<Reward> rewards = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "user_friends", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "friend_id"))
    private Set<User> friends = new HashSet<>();

    // --- JSONB (ID LISTS & METADATA) ---

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private List<Long> gamesInLibrary = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private List<Long> wishlist = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private List<Map<String, Object>> notifications = new ArrayList<>();

    // --- RELATIONSHIPS (ONE-TO-MANY) ---

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude // Stops the infinite loop in Java logs/debugging
    private List<CommunityPost> communityPosts = new ArrayList<>();
}
