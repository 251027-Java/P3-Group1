package com.example.Angular_spring_service.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Angular_spring_service.Service.UserProducerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/angulartest")
@RequiredArgsConstructor
@Slf4j
public class TestController {
    private final UserProducerService userProdServe;

    @PostMapping("/logpractice/{level}")
    public ResponseEntity<Void> logPracticeMessage(@RequestBody String message, @PathVariable int level) {
        log.info("Log Practice Message controller method called (level = " + level + "): " + message);
        userProdServe.logMessage(message, level);
        return ResponseEntity.ok().build();
    }
}
