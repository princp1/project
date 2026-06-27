package com.treasury.treasury.service;

import com.treasury.treasury.dto.AuthResponse;
import com.treasury.treasury.dto.LoginRequest;
import com.treasury.treasury.dto.RegisterRequest;
import com.treasury.treasury.entity.User;
import com.treasury.treasury.repository.UserRepos;
import com.treasury.treasury.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepos userRepos;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (userRepos.findByLogin(req.login()).isPresent()) {
            throw new IllegalArgumentException("Логин уже занят");
        }

        User user = new User();
        user.setLogin(req.login());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setFullName(req.fullName());
        user.setRole(req.role() == null || req.role().isBlank() ? "USER" : req.role());

        userRepos.save(user);

        String token = jwtUtil.generateToken(user.getLogin(), user.getRole());
        return new AuthResponse(token, user.getLogin(), user.getFullName(), user.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepos.findByLogin(req.login())
                .orElseThrow(() -> new IllegalArgumentException("Неверный логин или пароль"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new IllegalArgumentException("Неверный логин или пароль");
        }

        String token = jwtUtil.generateToken(user.getLogin(), user.getRole());
        return new AuthResponse(token, user.getLogin(), user.getFullName(), user.getRole());
    }
}