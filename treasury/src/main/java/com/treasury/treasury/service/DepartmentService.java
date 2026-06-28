package com.treasury.treasury.service;

import com.treasury.treasury.model.Department;
import com.treasury.treasury.repository.DepartmentRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository repo;

    @PostConstruct
    public void seed() {
        if (repo.count() == 0) {
            repo.save(Department.builder().name("Маркетинг").build());
            repo.save(Department.builder().name("Канцелярия").build());
            repo.save(Department.builder().name("Системные администраторы").build());
        }
    }

    public List<Department> list() { return repo.findAll(); }
}