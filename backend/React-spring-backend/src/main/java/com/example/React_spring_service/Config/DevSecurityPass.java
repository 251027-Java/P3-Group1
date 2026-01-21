package com.example.React_spring_service.Config;

// CORRECT IMPORTS
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class DevSecurityPass {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { // Use HttpSecurity
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll());
        return http.build();
    }
}