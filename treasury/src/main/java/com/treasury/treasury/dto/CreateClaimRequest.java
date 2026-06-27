package com.treasury.treasury.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateClaimRequest {

    @NotBlank(message = "Описание обязательно")
    private String description;

    @NotNull(message = "Сумма обязательна")
    @Positive(message = "Сумма должна быть положительной")
    private BigDecimal amount;

    @NotNull(message = "ID контрагента обязателен")
    private Long contractorId;

    @NotNull(message = "ID счёта обязателен")
    private Long accountId;
}