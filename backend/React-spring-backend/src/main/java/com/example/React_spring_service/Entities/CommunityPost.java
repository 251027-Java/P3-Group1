package com.example.React_spring_service.Entities;

import jakarta.persistence.*;
import lombok.*;
import com.example.React_spring_service.Enum.PostType;
import java.time.LocalDateTime;
import java.util.List;

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

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private PostType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @Builder.Default
    private LocalDateTime dateCreated = LocalDateTime.now();
}
