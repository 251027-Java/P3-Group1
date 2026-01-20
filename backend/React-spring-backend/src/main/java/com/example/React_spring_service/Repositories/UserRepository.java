package com.example.React_spring_service.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.React_spring_service.Entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Find a user by display name for search or login logic
    Optional<User> findByDisplayName(String displayName);
}