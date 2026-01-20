// package com.example.Angular_spring_service.Config;

// import org.apache.kafka.clients.admin.NewTopic;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.kafka.config.TopicBuilder;

// @Configuration
// public class KafkaConfig {

// @Bean
// public NewTopic userUpdates() {
// return TopicBuilder.name("user-updates")
// .partitions(3) // Higher partitions = better performance/scaling
// .replicas(1) // Local dev only needs 1
// .build();
// }
// }