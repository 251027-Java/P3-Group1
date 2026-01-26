package com.example.Angular_spring_service.Controller;

import com.example.Angular_spring_service.Service.UserProducerService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private UserProducerService userProducerService;

    @InjectMocks
    private AuthController authController;

    @Test
    void practiceMessage_Success() {
        String message = "hello";
        String key = "123";

        ResponseEntity<Void> response = authController.practiceMessage(message, key);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userProducerService).sendMessage(message, key);
    }

    @Test
    void logPracticeMessage_Success() {
        String message = "log me";
        int level = 1;

        ResponseEntity<Void> response = authController.logPracticeMessage(message, level);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userProducerService).logMessage(message, level);
    }
}
