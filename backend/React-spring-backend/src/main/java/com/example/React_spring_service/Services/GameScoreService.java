package com.example.React_spring_service.Services;

import com.example.React_spring_service.DTO.GameScoreDTO;
import com.example.React_spring_service.DTO.LeaderboardEntryDTO;
import com.example.React_spring_service.Entities.GameScore;
import com.example.React_spring_service.Entities.PlayableGame;
import com.example.React_spring_service.Entities.User;
import com.example.React_spring_service.Repositories.GameScoreRepository;
import com.example.React_spring_service.Repositories.PlayableGameRepository;
import com.example.React_spring_service.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class GameScoreService {
    
    @Autowired
    private GameScoreRepository gameScoreRepository;
    
    @Autowired
    private PlayableGameRepository playableGameRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Submit a new game score
     */
    @Transactional
    public GameScore submitScore(GameScoreDTO scoreDTO) {
        User user = userRepository.findById(scoreDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + scoreDTO.getUserId()));
        
        PlayableGame playableGame = playableGameRepository.findById(scoreDTO.getGameId())
                .orElseThrow(() -> new RuntimeException("Playable game not found with ID: " + scoreDTO.getGameId()));
        
        GameScore gameScore = GameScore.builder()
                .user(user)
                .playableGame(playableGame)
                .score(scoreDTO.getScore())
                .level(scoreDTO.getLevel())
                .build();
        
        return gameScoreRepository.save(gameScore);
    }
    
    /**
     * Get leaderboard for a specific playable game
     */
    public List<LeaderboardEntryDTO> getLeaderboard(Long playableGameId, int limit) {
        List<GameScore> topScores = gameScoreRepository.findTopScoresByGameId(
                playableGameId, 
                PageRequest.of(0, limit)
        );
        
        return IntStream.range(0, topScores.size())
                .mapToObj(index -> {
                    GameScore score = topScores.get(index);
                    return LeaderboardEntryDTO.builder()
                            .rank(index + 1)
                            .displayName(score.getUser().getDisplayName())
                            .score(score.getScore())
                            .level(score.getLevel())
                            .timestamp(score.getTimestamp())
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Get user's best score for a specific playable game
     */
    public Optional<GameScore> getUserBestScore(Long userId, Long playableGameId) {
        return gameScoreRepository.findTopByUserIdAndPlayableGameIdOrderByScoreDesc(userId, playableGameId);
    }
    
    /**
     * Get all scores for a user in a specific playable game
     */
    public List<GameScore> getUserGameScores(Long userId, Long playableGameId) {
        return gameScoreRepository.findByUserIdAndPlayableGameIdOrderByScoreDesc(userId, playableGameId);
    }
    
    /**
     * Get all scores for a user across all playable games
     */
    public List<GameScore> getUserAllScores(Long userId) {
        return gameScoreRepository.findByUserIdOrderByTimestampDesc(userId);
    }
    
    /**
     * Get all scores for a playable game
     */
    public List<GameScore> getScoresByGame(Long playableGameId) {
        return gameScoreRepository.findByPlayableGameIdOrderByScoreDesc(playableGameId);
    }
    
    /**
     * Get all scores
     */
    public List<GameScore> getAllScores() {
        return gameScoreRepository.findAll();
    }
    
    /**
     * Delete a score
     */
    @Transactional
    public void deleteScore(Long scoreId) {
        if (!gameScoreRepository.existsById(scoreId)) {
            throw new RuntimeException("Score not found with ID: " + scoreId);
        }
        gameScoreRepository.deleteById(scoreId);
    }
}
