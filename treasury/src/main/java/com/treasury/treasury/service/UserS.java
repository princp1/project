package com.treasury.treasury.service;

import com.treasury.treasury.dto.AuthResponse;
import com.treasury.treasury.dto.LoginRequest;
import com.treasury.treasury.dto.RegisterRequest;
import com.treasury.treasury.dto.UserResponse;
import com.treasury.treasury.model.User;
import com.treasury.treasury.repository.UserRepos;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.treasury.treasury.repository.DepartmentRepository;

@Service
@RequiredArgsConstructor
public class UserS {

    private final UserRepos userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final DepartmentRepository departmentRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByLogin(request.getLogin())) {
            throw new RuntimeException("Пользователь с таким логином уже существует");
        }

        User user = User.builder()
                .login(request.getLogin())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .department(request.getDepartmentId() != null

                        ? departmentRepository.findById(request.getDepartmentId())

                        .orElseThrow(() -> new RuntimeException("Подразделение не найдено"))

                        : null)
                .build();

        user = userRepository.save(user);

        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .login(user.getLogin())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new RuntimeException("Неверный логин или пароль"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Неверный логин или пароль");
        }

        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .login(user.getLogin())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    public UserResponse getCurrentUser(User user) {
        return UserResponse.from(user);
    }

    public User findByLogin(String login) {
        return userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }
}