package com.example.React_spring_service.Services;

import com.example.React_spring_service.DTO.GameScoreDTO;
import com.example.React_spring_service.DTO.LeaderboardEntryDTO;
import com.example.React_spring_service.Entities.GameScore;
import com.example.React_spring_service.Entities.PlayableGame;
import com.example.React_spring_service.Entities.User;
import com.example.React_spring_service.Repositories.GameScoreRepository;
import com.example.React_spring_service.Repositories.PlayableGameRepository;
import com.example.React_spring_service.Repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GameScoreServiceTest {

    @Mock
    private GameScoreRepository gameScoreRepository;

    @Mock
    private PlayableGameRepository playableGameRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GameScoreService gameScoreService;

    private User testUser;
    private PlayableGame testGame;
    private GameScoreDTO testScoreDTO;
    private GameScore testScore;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setDisplayName("TestUser");

        testGame = PlayableGame.builder()
                .id(1L)
                .name("Test Game")
                .description("Test Description")
                .build();

        testScoreDTO = new GameScoreDTO();
        testScoreDTO.setUserId(1L);
        testScoreDTO.setGameId(1L);
        testScoreDTO.setScore(100);
        testScoreDTO.setLevel(1);

        testScore = GameScore.builder()
                .id(1L)
                .user(testUser)
                .playableGame(testGame)
                .score(100)
                .level(1)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Test
    void submitScore_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(playableGameRepository.findById(1L)).thenReturn(Optional.of(testGame));
        when(gameScoreRepository.save(any(GameScore.class))).thenReturn(testScore);

        GameScore result = gameScoreService.submitScore(testScoreDTO);

        assertNotNull(result);
        assertEquals(100, result.getScore());
        assertEquals(testUser, result.getUser());
        assertEquals(testGame, result.getPlayableGame());
        verify(gameScoreRepository).save(any(GameScore.class));
    }

    @Test
    void getLeaderboard_Success() {
        List<GameScore> scores = Arrays.asList(testScore);
        when(gameScoreRepository.findTopScoresByGameId(eq(1L), any(PageRequest.class)))
                .thenReturn(scores);

        List<LeaderboardEntryDTO> leaderboard = gameScoreService.getLeaderboard(1L, 10);

        assertNotNull(leaderboard);
        assertEquals(1, leaderboard.size());
        assertEquals("TestUser", leaderboard.get(0).getDisplayName());
        assertEquals(100, leaderboard.get(0).getScore());
    }

    @Test
    void getUserBestScore_Success() {
        when(gameScoreRepository.findTopByUserIdAndPlayableGameIdOrderByScoreDesc(1L, 1L))
                .thenReturn(Optional.of(testScore));

        Optional<GameScore> result = gameScoreService.getUserBestScore(1L, 1L);

        assertTrue(result.isPresent());
        assertEquals(100, result.get().getScore());
    }

    @Test
    void deleteScore_Success() {
        when(gameScoreRepository.existsById(1L)).thenReturn(true);
        doNothing().when(gameScoreRepository).deleteById(1L);

        assertDoesNotThrow(() -> gameScoreService.deleteScore(1L));
        verify(gameScoreRepository).deleteById(1L);
    }
}
