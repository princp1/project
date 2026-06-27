package com.treasury.treasury.service;

import com.treasury.treasury.entity.StatusClaim;
import com.treasury.treasury.repository.StatusRepos;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatusClaimS {
    private final StatusRepos repository;

    public StatusClaimS(StatusRepos repository) {
        this.repository = repository;
    }

    public List<StatusClaim> getAll() {
        return repository.findAll();
    }

    public StatusClaim getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public StatusClaim save(StatusClaim status) {
        return repository.save(status);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}