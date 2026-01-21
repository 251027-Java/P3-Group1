package com.example.React_spring_service.Controller;

import com.example.React_spring_service.Entities.User;
import com.example.React_spring_service.Services.UserService;
import com.example.React_spring_service.Enum.UserLevel;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{displayName}")
    public ResponseEntity<User> getUserByDisplayName(@PathVariable String displayName) {
        return userService.getUserByDisplayName(displayName)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestParam String displayName,
            @RequestParam(required = false) String displayImage,
            @RequestParam(defaultValue = "USER") UserLevel level,
            @RequestParam(defaultValue = "false") boolean canSell) {
        User user = userService.createUser(displayName, displayImage, level, canSell);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestParam(required = false) String displayName,
            @RequestParam(required = false) String displayImage,
            @RequestParam(required = false) UserLevel level,
            @RequestParam(required = false) Boolean canSell) {
        User user = userService.updateUserProfile(id, displayName, displayImage, level, canSell);
        return ResponseEntity.ok(user);
    }
}
