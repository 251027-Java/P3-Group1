package com.example.React_spring_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient(autoRegister = true)
public class ReactSpringServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReactSpringServiceApplication.class, args);
	}

}