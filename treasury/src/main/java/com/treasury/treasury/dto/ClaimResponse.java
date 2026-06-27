package com.treasury.treasury.dto;

import com.treasury.treasury.model.Claim;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimResponse {
    private Long id;
    private String description;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private LocalDateTime paidAt;
    private String approvedBy;
    private String paidBy;
    private String rejectionReason;
    private UserResponse user;
    private ContractorResponse contractor;
    private AccountResponse account;

    public static ClaimResponse from(Claim claim) {
        return ClaimResponse.builder()
                .id(claim.getId())
                .description(claim.getDescription())
                .amount(claim.getAmount())
                .status(claim.getStatus().name())
                .createdAt(claim.getCreatedAt())
                .approvedAt(claim.getApprovedAt())
                .paidAt(claim.getPaidAt())
                .approvedBy(claim.getApprovedBy())
                .paidBy(claim.getPaidBy())
                .rejectionReason(claim.getRejectionReason())
                .user(UserResponse.from(claim.getUser()))
                .contractor(ContractorResponse.from(claim.getContractor()))
                .account(AccountResponse.from(claim.getAccount()))
                .build();
    }
}