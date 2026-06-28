package com.treasury.treasury.dto;

import com.treasury.treasury.model.Claim;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimResponse {
    private Long id;
    private String claimNumber;
    private LocalDateTime createdAt;
    private UserShort initiator;          // login, fullName, role, departmentName
    private ContractorShort contractor;   // id, name, inn
    private BigDecimal amount;
    private Integer vatRate;
    private String description;
    private String status;
    private Long accountId;               // null, пока не выбран
    private String rejectionReason;       // последний комментарий при отклонении
    private List<AttachmentShort> attachments;

    @Data @Builder
    public static class UserShort {
        private String login;
        private String fullName;
        private String role;
        private String department;
    }
    @Data @Builder
    public static class ContractorShort {
        private Long id;
        private String name;
        private String inn;
    }
    @Data @Builder
    public static class AttachmentShort {
        private Long id;
        private String filename;
        private Long sizeBytes;
    }

    public static ClaimResponse from(Claim c) {
        return ClaimResponse.builder()
                .id(c.getId())
                .claimNumber(c.getClaimNumber())
                .createdAt(c.getCreatedAt())
                .initiator(UserShort.builder()
                        .login(c.getUser().getLogin())
                        .fullName(c.getUser().getFullName())
                        .role(c.getUser().getRole().name())
                        .department(c.getUser().getDepartment() != null
                                ? c.getUser().getDepartment().getName() : null)
                        .build())
                .contractor(ContractorShort.builder()
                        .id(c.getContractor().getId())
                        .name(c.getContractor().getName())
                        .inn(c.getContractor().getInn())
                        .build())
                .amount(c.getAmount())
                .vatRate(c.getVatRate())
                .description(c.getDescription())
                .status(c.getStatus().name())
                .accountId(c.getAccount() != null ? c.getAccount().getId() : null)
                .rejectionReason(c.getRejectionReason())
                .attachments(c.getAttachments() == null ? List.of() :
                        c.getAttachments().stream().map(a ->
                                AttachmentShort.builder()
                                        .id(a.getId())
                                        .filename(a.getOriginalFilename())
                                        .sizeBytes(a.getSizeBytes())
                                        .build()).toList())
                .build();
    }
}