package com.treasury.treasury.dto;

public record AuthResponse(
        String token,
        String login,
        String fullName,
        String role
) {}