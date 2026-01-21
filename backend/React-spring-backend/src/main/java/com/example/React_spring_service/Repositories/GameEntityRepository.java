package com.example.React_spring_service.Repositories;

import com.example.React_spring_service.Entities.GameEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GameEntityRepository extends JpaRepository<GameEntity, Long> {
    
    // Find game by name
    Optional<GameEntity> findByName(String name);
    
    // Check if game exists by name
    boolean existsByName(String name);
}
