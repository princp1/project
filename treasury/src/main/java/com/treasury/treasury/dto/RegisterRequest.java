package com.treasury.treasury.dto;

import com.treasury.treasury.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class RegisterRequest {

    @NotBlank private String login;

    @NotBlank @Size(min = 6) private String password;

    @NotBlank private String fullName;

    @NotNull private User.Role role;

    private Long departmentId; // обязателен для role=USER

}