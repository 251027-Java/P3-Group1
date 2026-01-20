package com.example.React_spring_service.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

import com.example.React_spring_service.Enum.RewardCategory;

@Entity
@Table(name = "rewards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Long costInCoins;

    @Enumerated(EnumType.STRING)
    private RewardCategory category;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Optional: If the reward is a discount, how much is it?
    private Double discountPercent;

    // --- RELATIONSHIPS ---

    // Many users can own this reward
    @ManyToMany(mappedBy = "rewards")
    @ToString.Exclude
    private Set<User> owners = new HashSet<>();
}
