package com.example.React_spring_service.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.React_spring_service.Entities.CoinTransaction;
import com.example.React_spring_service.Entities.User;
import com.example.React_spring_service.Repositories.CoinTransactionRepository;
import com.example.React_spring_service.Repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CoinController {

    private final UserRepository userRepository;
    private final CoinTransactionRepository transactionRepository;

    @GetMapping("/{userId}/balance")
    public ResponseEntity<Long> getBalance(@PathVariable Long userId) {
        List<CoinTransaction> txs = transactionRepository.findByUserIdOrderByTimestampDesc(userId);
        long sum = txs.stream().mapToLong(t -> t.getAmount()).sum();
        return ResponseEntity.ok(sum);
    }

    public static class TransactionRequest {
        public Long amount;
        public String reason;
    }

    @PostMapping("/{userId}/transactions")
    public ResponseEntity<?> createTransaction(@PathVariable Long userId, @RequestBody TransactionRequest req) {
        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        User user = userOpt.get();

        CoinTransaction tx = CoinTransaction.builder()
                .amount(req.amount)
                .reason(req.reason == null ? "MANUAL" : req.reason)
                .user(user)
                .build();

        CoinTransaction saved = transactionRepository.save(tx);

        // return new balance
        List<CoinTransaction> txs = transactionRepository.findByUserIdOrderByTimestampDesc(userId);
        long sum = txs.stream().mapToLong(t -> t.getAmount()).sum();

        return ResponseEntity.ok(Map.of("transaction", saved, "balance", sum));
    }
}
