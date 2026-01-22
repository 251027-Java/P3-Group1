package com.example.React_spring_service.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.React_spring_service.Entities.Game;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    // Find all games that are currently on sale
    List<Game> findByOnSaleTrue();

    @Query(value = "SELECT * FROM games g WHERE g.tags::jsonb ?& CAST(:tags AS text[])", nativeQuery = true)
    List<Game> findByTags(@Param("tags") List<String> tags);

    // // Find games containing a specific tag in the JSONB column
    // List<Game> findByTagsContaining(String tag);

    // Find game by name
    java.util.Optional<Game> findByName(String name);
}