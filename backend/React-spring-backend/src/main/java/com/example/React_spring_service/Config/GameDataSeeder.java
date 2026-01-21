package com.example.React_spring_service.Config;

import com.example.React_spring_service.Entities.GameEntity;
import com.example.React_spring_service.Repositories.GameEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class GameDataSeeder implements CommandLineRunner {
    
    @Autowired
    private GameEntityRepository gameEntityRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Seed games if they don't exist
        if (gameEntityRepository.count() == 0) {
            // Bubble Trouble
            GameEntity bubbleTrouble = GameEntity.builder()
                    .name("Bubble Trouble")
                    .description("Pop bubbles and clear levels in this classic arcade game!")
                    .build();
            gameEntityRepository.save(bubbleTrouble);
            
            // Flappy Bird
            GameEntity flappyBird = GameEntity.builder()
                    .name("Flappy Bird")
                    .description("Flap through pipes and score points in this addictive game!")
                    .build();
            gameEntityRepository.save(flappyBird);
            
            System.out.println("✅ Games seeded successfully!");
        }
    }
}
