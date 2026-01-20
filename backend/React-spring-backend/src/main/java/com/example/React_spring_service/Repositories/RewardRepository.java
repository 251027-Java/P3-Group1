package com.example.React_spring_service.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.React_spring_service.Entities.Reward;
import com.example.React_spring_service.Enum.RewardCategory;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    // Find rewards by category (e.g., all DISCOUNTS)
    List<Reward> findByCategory(RewardCategory category);
}
