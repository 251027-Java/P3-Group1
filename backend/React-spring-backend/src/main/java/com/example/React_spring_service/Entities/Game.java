package com.example.React_spring_service.Entities;

import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.Convert;
import jakarta.persistence.Lob;
import com.example.React_spring_service.Config.JsonConverter;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "date_released")
    private LocalDate dateReleased;

    private Double rating; // Aggregate rating (e.g., 4.5)

    private String developer; // Primary Dev name
    private String publisher;
    private String size; // e.g., "1.2 GB"

    // Images stored as paths/URLs
    private String profileImage;
    private String backgroundImage;

    // Pricing Logic
    private Double price;
    private Double salePercent; // e.g., 20.0 for 20%

    @Builder.Default
    private boolean onSale = false;

    // --- JSONB DATA ---

    @Lob
    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.class)
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Lob
    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.class)
    @Builder.Default
    private List<Map<String, String>> developerLogs = new ArrayList<>();
    // Structure: {"title": "Update v1.1", "description": "Fixed bugs..."}

    @Lob
    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.class)
    @Builder.Default
    private List<Map<String, Object>> rewards = new ArrayList<>();
    // Structure: {"id": 1, "title": "Gold Skin", "cost": 500}

    // --- RELATIONSHIPS ---

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<Review> reviews = new ArrayList<>();

    // Logic to auto-update onSale status
    public void updateSaleStatus() {
        this.onSale = this.salePercent != null && this.salePercent > 1.0;
    }
}