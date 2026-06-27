package com.treasury.treasury.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContractorRequest {

    @NotBlank(message = "Название обязательно")
    private String name;

    @NotBlank(message = "ИНН обязателен")
    private String inn;

    @NotBlank(message = "Расчётный счёт обязателен")
    private String bankAccount;

    private String address;
    private String phone;
    private String email;
}