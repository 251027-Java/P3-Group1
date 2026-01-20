package com.example.React_spring_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(exclude = {
		org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration.class
})
@EnableDiscoveryClient(autoRegister = false)
public class ReactSpringServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReactSpringServiceApplication.class, args);
	}

}