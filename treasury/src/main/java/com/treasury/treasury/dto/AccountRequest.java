package com.treasury.treasury.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountRequest {
    @NotBlank private String name;
    @NotBlank @Pattern(regexp = "\\d{20}") private String accountNumber;
    @NotBlank private String currency;
    @NotNull @PositiveOrZero private BigDecimal balance;
    private String bank;
}