package com.treasury.treasury.controller;

import com.treasury.treasury.dto.AccountRequest;
import com.treasury.treasury.dto.AccountResponse;
import com.treasury.treasury.dto.ApiResponse;
import com.treasury.treasury.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('DIRECTOR','FIN_MANAGER')")
    public ResponseEntity<?> list() {
        List<AccountResponse> r = service.list().stream()
                .map(AccountResponse::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(r));
    }

    @PostMapping
    @PreAuthorize("hasRole('FIN_MANAGER')")
    public ResponseEntity<?> create(@Valid @RequestBody AccountRequest r) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Счёт добавлен", AccountResponse.from(service.create(r))));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FIN_MANAGER')")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody AccountRequest r) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Обновлено", AccountResponse.from(service.update(id, r))));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FIN_MANAGER')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Удалено", null));
    }
}