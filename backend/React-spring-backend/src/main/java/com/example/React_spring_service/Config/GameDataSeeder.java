package com.example.React_spring_service.Config;

import com.example.React_spring_service.Entities.Game;
import com.example.React_spring_service.Repositories.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class GameDataSeeder implements CommandLineRunner {

    @Autowired
    private GameRepository gameRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed Bubble Trouble if it doesn't exist
        if (gameRepository.findByName("Bubble Trouble").isEmpty()) {
            Game bubbleTrouble = Game.builder()
                    .name("Bubble Trouble")
                    .description(
                            "Pop bubbles and clear levels in this classic arcade game! Avoid the bouncing bubbles and split them into smaller ones.")
                    .developer("Group 1")
                    .publisher("Revature")
                    .dateReleased(java.time.LocalDate.now())
                    .rating(4.5)
                    .price(10.0) // Play token cost
                    .tags(java.util.Arrays.asList("Action", "Arcade", "Shooter"))
                    .size("5 MB")
                    .onSale(false)
                    .build();
            gameRepository.save(bubbleTrouble);
            System.out.println("✅ Bubble Trouble seeded successfully!");
        }

        // Seed Flappy Bird if it doesn't exist
        if (gameRepository.findByName("Flappy Bird").isEmpty()) {
            Game flappyBird = Game.builder()
                    .name("Flappy Bird")
                    .description("Flap your wings to fly... but don't hit the pipes! A test of patience and skill.")
                    .developer("Group 1")
                    .publisher("Revature")
                    .dateReleased(java.time.LocalDate.now())
                    .rating(4.2)
                    .price(5.0) // Play token cost
                    .tags(java.util.Arrays.asList("Arcade", "Casual", "Indie"))
                    .size("2 MB")
                    .onSale(true)
                    .salePercent(20.0)
                    .build();
            flappyBird.updateSaleStatus();
            gameRepository.save(flappyBird);
            System.out.println("✅ Flappy Bird seeded successfully!");
        }

    }
}
