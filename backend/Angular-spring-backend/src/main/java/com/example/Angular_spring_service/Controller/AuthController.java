package com.example.Angular_spring_service.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Angular_spring_service.Service.UserProducerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class AuthController {

    private final UserProducerService userProdServe;

    @GetMapping("/practice")
    public ResponseEntity<Void> practiceMessage(@RequestParam String message, @RequestParam String key) {
        log.info("Practice Message controller method called (key = " + key + "): " + message);
        userProdServe.sendMessage(message, key);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/logpractice/{level}")
    public ResponseEntity<Void> logPracticeMessage(@RequestBody String message, @PathVariable int level) {
        log.info("Log Practice Message controller method called (level = " + level + "): " + message);
        userProdServe.logMessage(message, level);
        return ResponseEntity.ok().build();
    }

}
