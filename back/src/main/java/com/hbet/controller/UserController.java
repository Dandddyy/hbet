package com.hbet.controller;

import com.hbet.dto.UserCreateDTO;
import com.hbet.dto.UserDTO;
import com.hbet.filter.JwtUtil;
import com.hbet.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.getUser(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        System.out.println(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsers() {
        List<UserDTO> user = userService.getUsers();
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        System.out.println(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(
            @RequestBody UserCreateDTO userToCreate
    ) {
        UserDTO createdUser = userService.createUser(userToCreate);
        if (createdUser == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable Long id,
                                          @RequestBody UserDTO userToUpdate
    ) {
        int updatedRows = userService.updateUser(id, userToUpdate);
        if (updatedRows < 0) {
            return ResponseEntity.badRequest().build();
        } else if (updatedRows == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/refresh-token")
    public ResponseEntity<String> refreshToken(@PathVariable Long id) {
        UserDTO user = userService.getUser(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        String newToken = JwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName(), user.getMoney(), Math.toIntExact(user.getUserId()));
        return ResponseEntity.ok(newToken);
    }

}
