package com.example.React_spring_service.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.React_spring_service.Entities.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Critical: Get ONLY top-level comments (where parent is null)
    List<Comment> findByPostIdAndParentCommentIsNullOrderByDateCreatedAsc(Long postId);
}