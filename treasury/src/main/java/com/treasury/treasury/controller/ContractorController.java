package com.treasury.treasury.controller;

import com.treasury.treasury.dto.*;
import com.treasury.treasury.service.ContractorS;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contractors")
@RequiredArgsConstructor
public class ContractorController {

    private final ContractorS contractorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContractorResponse>>> getAll() {
        List<ContractorResponse> contractors = contractorService.getAll();
        return ResponseEntity.ok(ApiResponse.ok(contractors));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContractorResponse>> getById(@PathVariable Long id) {
        ContractorResponse contractor = contractorService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(contractor));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContractorResponse>> create(
            @Valid @RequestBody ContractorRequest request) {
        ContractorResponse contractor = contractorService.create(request);
        return ResponseEntity.ok(ApiResponse.ok("Контрагент создан", contractor));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContractorResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ContractorRequest request) {
        ContractorResponse contractor = contractorService.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Контрагент обновлён", contractor));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        contractorService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Контрагент удалён", null));
    }
}