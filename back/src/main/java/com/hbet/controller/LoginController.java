package com.hbet.controller;

import com.hbet.dto.LoginDTO;
import com.hbet.entity.User;
import com.hbet.filter.JwtUtil;
import com.hbet.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/login")
public class LoginController {
    @Autowired
    private LoginService loginService;

    @PostMapping()
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        if (loginService.authenticate(loginDTO)) {
            User user = loginService.findByEmail(loginDTO.getEmail());
            String token = JwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName(), user.getMoney(), Math.toIntExact(user.getUserId()));
            return ResponseEntity.ok("{\"token\":\"" + token + "\"}");
        } else {
            return ResponseEntity.status(401).body("{\"error\":\"Invalid email or password\"}");
        }
    }
}
