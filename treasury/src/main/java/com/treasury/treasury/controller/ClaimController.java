package com.treasury.treasury.controller;

import com.treasury.treasury.dto.*;
import com.treasury.treasury.model.Claim;
import com.treasury.treasury.model.User;
import com.treasury.treasury.service.ClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> create(
            @AuthenticationPrincipal User user,
            @RequestPart("data") CreateClaimRequest data,
            @RequestPart(value = "files", required = false) List<MultipartFile> files)
            throws IOException {
        Claim c = claimService.create(user, data, files);
        return ResponseEntity.ok(ApiResponse.ok("Заявка создана", ClaimResponse.from(c)));
    }

    @GetMapping
    public ResponseEntity<?> list(@AuthenticationPrincipal User user) {
        List<ClaimResponse> res = claimService.listFor(user).stream()
                .map(ClaimResponse::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(
                ClaimResponse.from(claimService.getFor(user, id))));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Согласовано", ClaimResponse.from(claimService.approve(user, id))));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam("reason") String reason) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Отклонено", ClaimResponse.from(claimService.reject(user, id, reason))));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<?> pay(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam("accountId") Long accountId) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Оплачено", ClaimResponse.from(claimService.setAccountAndPay(user, id, accountId))));
    }
}