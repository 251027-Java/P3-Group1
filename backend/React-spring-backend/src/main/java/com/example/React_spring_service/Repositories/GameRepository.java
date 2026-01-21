package com.example.React_spring_service.Repositories;

import com.example.React_spring_service.Entities.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
}
