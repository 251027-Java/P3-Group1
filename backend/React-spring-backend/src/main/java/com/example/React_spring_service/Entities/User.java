package com.example.React_spring_service.Entities;

import jakarta.persistence.*;
import lombok.*;
import com.example.React_spring_service.Enum.UserLevel;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}
