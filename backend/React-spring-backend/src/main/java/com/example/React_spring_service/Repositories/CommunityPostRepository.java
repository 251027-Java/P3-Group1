package com.example.React_spring_service.Repositories;

import com.example.React_spring_service.Entities.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
}
