package com.treasury.treasury.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.Pattern;  // <-- ВАЖНО: jakarta, НЕ javax!
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ContractorRequest {
    @NotBlank private String name;
    @NotBlank private String fullName;
    @Pattern(regexp = "\\d{10}|\\d{12}", message = "ИНН: 10 или 12 цифр")
    private String inn;
    @Pattern(regexp = "\\d{9}", message = "КПП: 9 цифр")
    private String kpp;
    private String bankAccount;
    private String address;
    private String phone;
    private String email;
}