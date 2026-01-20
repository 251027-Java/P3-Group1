package com.example.React_spring_service.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.React_spring_service.Entities.CommunityPost;
import com.example.React_spring_service.Enum.PostType;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    // Get feed by post type (e.g., NEWS only)
    List<CommunityPost> findByTypeOrderByDateCreatedDesc(PostType type);

    @Query(value = "SELECT tag, COUNT(*) as tag_count " +
            "FROM community_posts, jsonb_array_elements_text(tags) AS tag " +
            "GROUP BY tag " +
            "ORDER BY tag_count DESC " +
            "LIMIT 5", nativeQuery = true)
    List<String> findTopTags();
}