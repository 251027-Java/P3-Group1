package com.example.React_spring_service.Entities;

import jakarta.persistence.*;
import lombok.*;
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

    private String title;

    private Long costInCoins;

    @Enumerated(EnumType.STRING)
    private RewardCategory category;

    private Double discountPercent;
}
