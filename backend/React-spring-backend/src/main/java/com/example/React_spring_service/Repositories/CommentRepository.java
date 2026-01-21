package com.example.React_spring_service.Repositories;

import com.example.React_spring_service.Entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdAndParentCommentIsNullOrderByDateCreatedAsc(Long postId);
}
