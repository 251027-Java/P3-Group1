package com.example.React_spring_service.Repositories;

import com.example.React_spring_service.Entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
