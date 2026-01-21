package com.example.React_spring_service.Repositories;

import com.example.React_spring_service.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByDisplayName(String displayName);
}
