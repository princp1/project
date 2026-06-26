package com.treasury.treasury.service;

import com.treasury.treasury.entity.SettlementAccount;
import com.treasury.treasury.repository.SetAccountRepos;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SetAccountS {
    private final SetAccountRepos repository;

    public SetAccountS(SetAccountRepos repository) {
        this.repository = repository;
    }

    public List<SettlementAccount> getAll() {
        return repository.findAll();
    }

    public SettlementAccount getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public List<SettlementAccount> getByContractor(Integer contractorId) {
        return repository.findByContractorId(contractorId);
    }

    public SettlementAccount save(SettlementAccount account) {
        return repository.save(account);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}