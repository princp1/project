package com.treasury.treasury.dto;

import com.treasury.treasury.model.Contractor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder
public class ContractorResponse {
    private Long id;
    private String name;
    private String fullName;
    private String inn;
    private String kpp;
    private String bankAccount;
    private String address;
    private String phone;
    private String email;

    public static ContractorResponse from(Contractor c) {
        return ContractorResponse.builder()
                .id(c.getId()).name(c.getName()).fullName(c.getFullName())
                .inn(c.getInn()).kpp(c.getKpp())
                .bankAccount(c.getBankAccount())
                .address(c.getAddress()).phone(c.getPhone()).email(c.getEmail())
                .build();
    }
}