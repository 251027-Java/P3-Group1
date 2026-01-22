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
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
// @CrossOrigin(origins = "*")
@Slf4j
public class CoinController {

    private final UserRepository userRepository;
    private final CoinTransactionRepository transactionRepository;

    @GetMapping("/{userId}/balance")
    public ResponseEntity<Long> getBalance(@PathVariable Long userId) {
        log.info("Fetching balance for user ID: " + userId);
        List<CoinTransaction> txs = transactionRepository.findByUserIdOrderByTimestampDesc(userId);
        long sum = txs.stream().mapToLong(t -> t.getAmount()).sum();
        log.info("Balance for user ID " + userId + " is: " + sum);
        return ResponseEntity.ok(sum);
    }

    public static class TransactionRequest {
        public Long amount;
        public String reason;
    }

    @PostMapping("/{userId}/transactions")
    public ResponseEntity<?> createTransaction(@PathVariable Long userId, @RequestBody TransactionRequest req) {
        log.info("Creating transaction for user ID: " + userId + " with amount: " + req.amount);

        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.debug("User with ID " + userId + " not found.");
            return ResponseEntity.notFound().build();
        }
        User user = userOpt.get();
        if (req.amount == null) {
            log.error("Amount is required for transaction.");
            return ResponseEntity.badRequest().body(Map.of("error", "amount_required"));
        }

        // Calculate current balance
        List<CoinTransaction> txsBefore = transactionRepository.findByUserIdOrderByTimestampDesc(userId);
        long currentBalance = txsBefore.stream().mapToLong(t -> t.getAmount()).sum();

        // If this is a spend (negative amount), ensure sufficient funds
        if (req.amount < 0 && (currentBalance + req.amount) < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "insufficient_funds", "balance", currentBalance));
        }

        CoinTransaction tx = CoinTransaction.builder()
                .amount(req.amount)
                .reason(req.reason == null ? "MANUAL" : req.reason)
                .user(user)
                .build();

        CoinTransaction saved = transactionRepository.save(tx);

        // return new balance
        List<CoinTransaction> txs = transactionRepository.findByUserIdOrderByTimestampDesc(userId);
        long sum = txs.stream().mapToLong(t -> t.getAmount()).sum();

        log.info("transaction = " + saved + ", balance = " + sum);

        return ResponseEntity.ok(Map.of("transaction", saved, "balance", sum));
    }
}
