package com.treasury.treasury.controller;

import com.treasury.treasury.dto.ApiResponse;
import com.treasury.treasury.dto.ContractorRequest;
import com.treasury.treasury.dto.ContractorResponse;
import com.treasury.treasury.service.ContractorService;
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

    private final ContractorService service;

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(required = false) String search) {
        List<ContractorResponse> r = service.list(search).stream()
                .map(ContractorResponse::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(r));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(
                ContractorResponse.from(service.get(id))));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DIRECTOR','FIN_MANAGER')")
    public ResponseEntity<?> create(@Valid @RequestBody ContractorRequest r) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Контрагент добавлен", ContractorResponse.from(service.create(r))));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIRECTOR','FIN_MANAGER')")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody ContractorRequest r) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Обновлено", ContractorResponse.from(service.update(id, r))));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIRECTOR','FIN_MANAGER')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Удалено", null));
    }
}