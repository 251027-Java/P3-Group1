package com.example.React_spring_service.Services;

import com.example.React_spring_service.Entities.User;
import com.example.React_spring_service.Entities.Game;
import com.example.React_spring_service.Repositories.GameRepository;
import com.example.React_spring_service.Repositories.RewardRepository;
import com.example.React_spring_service.Repositories.UserRepository;
import com.example.React_spring_service.Enum.UserLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RewardRepository rewardRepository;

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Game testGame;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setDisplayName("TestUser");
        testUser.setGamesInLibrary(new ArrayList<>());
        testUser.setWishlist(new ArrayList<>());

        testGame = new Game();
        testGame.setId(100L);
        testGame.setName("Test Game");
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        Optional<User> result = userService.getUserById(1L);

        assertTrue(result.isPresent());
        assertEquals("TestUser", result.get().getDisplayName());
    }

    @Test
    void updateUserProfile_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User updatedUser = userService.updateUserProfile(1L, "NewName", "NewImage", UserLevel.DEVELOPER, true);

        assertEquals("NewName", updatedUser.getDisplayName());
        assertEquals("NewImage", updatedUser.getDisplayImage());
        assertEquals(UserLevel.DEVELOPER, updatedUser.getLevel());
        assertTrue(updatedUser.isCanSell());
    }

    @Test
    void addGameToLibrary_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(gameRepository.findById(100L)).thenReturn(Optional.of(testGame));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.addGameToLibrary(1L, 100L);

        assertTrue(testUser.getGamesInLibrary().contains(100L));
    }

    @Test
    void addGameToWishlist_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(gameRepository.findById(100L)).thenReturn(Optional.of(testGame));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.addGameToWishlist(1L, 100L);

        assertTrue(testUser.getWishlist().contains(100L));
    }
}
