package com.treasury.treasury.controller;

import com.treasury.treasury.dto.*;
import com.treasury.treasury.service.SetAccountS;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final SetAccountS accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAll() {
        List<AccountResponse> accounts = accountService.getAll();
        return ResponseEntity.ok(ApiResponse.ok(accounts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getById(@PathVariable Long id) {
        AccountResponse account = accountService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(account));
    }
}