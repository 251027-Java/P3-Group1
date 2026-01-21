package com.example.Angular_spring_service.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Angular_spring_service.Service.UserProducerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserProducerService userProdServe;

    @GetMapping("/practice")
    public ResponseEntity<Void> practiceMessage(@RequestParam String message, @RequestParam String key) {

        userProdServe.sendMessage(message, key);
        return ResponseEntity.ok().build();

    }

}
