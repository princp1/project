package com.treasury.treasury.controller;

import com.treasury.treasury.dto.*;
import com.treasury.treasury.model.User;
import com.treasury.treasury.service.ClaimS;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimS claimService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getAll(
            @AuthenticationPrincipal User user) {
        List<ClaimResponse> claims;

        if (user.getRole() == User.Role.ADMIN ||
                user.getRole() == User.Role.APPROVER ||
                user.getRole() == User.Role.PAYMENT_MANAGER) {
            claims = claimService.getAll();
        } else {
            claims = claimService.getByUserId(user.getId());
        }

        return ResponseEntity.ok(ApiResponse.ok(claims));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClaimResponse>> getById(@PathVariable Long id) {
        ClaimResponse claim = claimService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(claim));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClaimResponse>> create(
            @Valid @RequestBody CreateClaimRequest request,
            @AuthenticationPrincipal User user) {
        ClaimResponse claim = claimService.create(request, user);
        return ResponseEntity.ok(ApiResponse.ok("Заявка создана", claim));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'APPROVER')")
    public ResponseEntity<ApiResponse<ClaimResponse>> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal User approver) {
        ClaimResponse claim = claimService.approve(id, approver);
        return ResponseEntity.ok(ApiResponse.ok("Заявка одобрена", claim));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'APPROVER')")
    public ResponseEntity<ApiResponse<ClaimResponse>> reject(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User approver) {
        ClaimResponse claim = claimService.reject(id, approver, body.get("reason"));
        return ResponseEntity.ok(ApiResponse.ok("Заявка отклонена", claim));
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('ADMIN', 'PAYMENT_MANAGER')")
    public ResponseEntity<ApiResponse<ClaimResponse>> pay(
            @PathVariable Long id,
            @AuthenticationPrincipal User paymentManager) {
        ClaimResponse claim = claimService.pay(id, paymentManager);
        return ResponseEntity.ok(ApiResponse.ok("Заявка оплачена", claim));
    }
}