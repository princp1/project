package com.treasury.treasury.service;

import com.treasury.treasury.entity.Contractor;
import com.treasury.treasury.repository.ContractorRepos;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContractorS {
    private final ContractorRepos repository;

    public ContractorS(ContractorRepos repository) {
        this.repository = repository;
    }

    public List<Contractor> getAll() {
        return repository.findAll();
    }

    public Contractor getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public Contractor findByInn(String inn) {
        return repository.findByInn(inn);
    }

    public Contractor save(Contractor contractor) {
        return repository.save(contractor);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}