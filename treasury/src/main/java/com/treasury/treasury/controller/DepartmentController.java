package com.treasury.treasury.controller;

import com.treasury.treasury.dto.ApiResponse;
import com.treasury.treasury.model.Department;
import com.treasury.treasury.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService service;

    @GetMapping
    public ResponseEntity<?> list() {
        List<Department> all = service.list();
        return ResponseEntity.ok(ApiResponse.ok(all));
    }
}