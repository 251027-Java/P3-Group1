package com.example.React_spring_service.Repositories;

import com.example.React_spring_service.Entities.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
}
