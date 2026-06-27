package com.treasury.treasury.dto;

import com.treasury.treasury.model.Contractor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractorResponse {
    private Long id;
    private String name;
    private String inn;
    private String bankAccount;
    private String address;
    private String phone;
    private String email;
    private LocalDateTime createdAt;

    public static ContractorResponse from(Contractor contractor) {
        return ContractorResponse.builder()
                .id(contractor.getId())
                .name(contractor.getName())
                .inn(contractor.getInn())
                .bankAccount(contractor.getBankAccount())
                .address(contractor.getAddress())
                .phone(contractor.getPhone())
                .email(contractor.getEmail())
                .createdAt(contractor.getCreatedAt())
                .build();
    }
}