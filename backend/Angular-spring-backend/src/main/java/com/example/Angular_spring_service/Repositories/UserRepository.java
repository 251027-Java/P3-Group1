package com.example.Angular_spring_service.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Angular_spring_service.Entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
