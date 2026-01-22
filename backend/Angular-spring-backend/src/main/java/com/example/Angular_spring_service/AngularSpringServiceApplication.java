package com.example.Angular_spring_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EnableDiscoveryClient
@Slf4j
public class AngularSpringServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AngularSpringServiceApplication.class, args);
		log.info("(Custom Log) Angular Spring backend has started!");
	}

}
