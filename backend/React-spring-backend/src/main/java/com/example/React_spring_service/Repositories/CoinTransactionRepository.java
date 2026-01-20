package com.example.React_spring_service.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.React_spring_service.Entities.CoinTransaction;

@Repository
public interface CoinTransactionRepository extends JpaRepository<CoinTransaction, Long> {
    // Get the full transaction history for a specific user
    List<CoinTransaction> findByUserIdOrderByTimestampDesc(Long userId);
}
