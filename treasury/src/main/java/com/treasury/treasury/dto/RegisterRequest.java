package com.treasury.treasury.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String login,
        @NotBlank @Size(min = 4) String password,
        @NotBlank String fullName,
        String role
) {}