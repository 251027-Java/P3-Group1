package com.example.Angular_spring_service.Service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class UserProducerServiceTest {

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    @InjectMocks
    private UserProducerService userProducerService;

    @Test
    void sendMessage_Success() {
        String testMessage = "Test Update";
        String testKey = "123";
        // The service uses "test-update" as the topic constant
        String expectedTopic = "test-update";

        userProducerService.sendMessage(testMessage, testKey);

        verify(kafkaTemplate).send(eq(expectedTopic), eq(testKey), eq(testMessage));
    }
}
