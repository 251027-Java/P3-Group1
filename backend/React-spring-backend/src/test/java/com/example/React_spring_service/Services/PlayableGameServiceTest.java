package com.example.React_spring_service.Services;

import com.example.React_spring_service.Entities.PlayableGame;
import com.example.React_spring_service.Repositories.PlayableGameRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PlayableGameServiceTest {

    @Mock
    private PlayableGameRepository playableGameRepository;

    @InjectMocks
    private PlayableGameService playableGameService;

    private PlayableGame testGame;

    @BeforeEach
    void setUp() {
        testGame = PlayableGame.builder()
                .id(1L)
                .name("New Game")
                .description("New Description")
                .build();
    }

    @Test
    void createPlayableGame_Success() {
        when(playableGameRepository.existsByName("New Game")).thenReturn(false);
        when(playableGameRepository.save(any(PlayableGame.class))).thenReturn(testGame);

        PlayableGame result = playableGameService.createPlayableGame("New Game", "New Description");

        assertNotNull(result);
        assertEquals("New Game", result.getName());
        verify(playableGameRepository).save(any(PlayableGame.class));
    }

    @Test
    void createPlayableGame_DuplicateName_ThrowsException() {
        when(playableGameRepository.existsByName("New Game")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> {
            playableGameService.createPlayableGame("New Game", "Desc");
        });

        verify(playableGameRepository, never()).save(any(PlayableGame.class));
    }

    @Test
    void getAllPlayableGames_ReturnsList() {
        when(playableGameRepository.findAll()).thenReturn(Arrays.asList(testGame));

        List<PlayableGame> result = playableGameService.getAllPlayableGames();

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("New Game", result.get(0).getName());
    }

    @Test
    void getPlayableGameById_Success() {
        when(playableGameRepository.findById(1L)).thenReturn(Optional.of(testGame));

        Optional<PlayableGame> result = playableGameService.getPlayableGameById(1L);

        assertTrue(result.isPresent());
        assertEquals("New Game", result.get().getName());
    }
}
