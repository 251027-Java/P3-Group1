package com.example.React_spring_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EnableDiscoveryClient(autoRegister = true)
@Slf4j
public class ReactSpringServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReactSpringServiceApplication.class, args);
		log.info("(Custom Log) React Spring backend has started!");
	}

}