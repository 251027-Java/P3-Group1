package com.example.Angular_spring_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(exclude = {
		org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration.class
})
@EnableDiscoveryClient(autoRegister = false)
public class AngularSpringServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AngularSpringServiceApplication.class, args);
	}

}
