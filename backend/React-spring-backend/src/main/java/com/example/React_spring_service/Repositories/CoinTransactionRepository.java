package com.example.React_spring_service.Repositories;

import com.example.React_spring_service.Entities.CoinTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinTransactionRepository extends JpaRepository<CoinTransaction, Long> {
}
