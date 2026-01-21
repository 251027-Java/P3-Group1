package com.example.React_spring_service.Repositories;

import com.example.React_spring_service.Entities.GameScore;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameScoreRepository extends JpaRepository<GameScore, Long> {

    /**
     * Find top scores for a playable game (for leaderboard)
     */
    @Query("SELECT gs FROM GameScore gs WHERE gs.playableGame.id = :gameId ORDER BY gs.score DESC, gs.timestamp ASC")
    List<GameScore> findTopScoresByGameId(@Param("gameId") Long gameId, Pageable pageable);

    /**
     * Find user's best score for a playable game
     */
    Optional<GameScore> findTopByUserIdAndPlayableGameIdOrderByScoreDesc(Long userId, Long playableGameId);

    /**
     * Find all scores for a user in a specific playable game
     */
    List<GameScore> findByUserIdAndPlayableGameIdOrderByScoreDesc(Long userId, Long playableGameId);

    /**
     * Find all scores for a user
     */
    List<GameScore> findByUserIdOrderByTimestampDesc(Long userId);

    /**
     * Find all scores for a playable game
     */
    List<GameScore> findByPlayableGameIdOrderByScoreDesc(Long playableGameId);
}
