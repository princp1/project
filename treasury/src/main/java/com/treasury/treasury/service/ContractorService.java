package com.treasury.treasury.service;

import com.treasury.treasury.dto.ContractorRequest;
import com.treasury.treasury.model.Contractor;
import com.treasury.treasury.repository.ContractorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractorService {

    private final ContractorRepository repo;

    public List<Contractor> list(String search) {
        if (search == null || search.isBlank()) return repo.findAll();
        return repo.findByNameContainingIgnoreCaseOrInnContaining(search, search);
    }

    public Contractor get(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Не найден"));
    }

    @Transactional
    public Contractor create(ContractorRequest r) {
        Contractor c = Contractor.builder()
                .name(r.getName()).fullName(r.getFullName())
                .inn(r.getInn()).kpp(r.getKpp())
                .bankAccount(r.getBankAccount())
                .address(r.getAddress()).phone(r.getPhone()).email(r.getEmail())
                .build();
        return repo.save(c);
    }

    @Transactional
    public Contractor update(Long id, ContractorRequest r) {
        Contractor c = get(id);
        c.setName(r.getName()); c.setFullName(r.getFullName());
        c.setInn(r.getInn()); c.setKpp(r.getKpp());
        c.setBankAccount(r.getBankAccount());
        c.setAddress(r.getAddress()); c.setPhone(r.getPhone()); c.setEmail(r.getEmail());
        return repo.save(c);
    }

    @Transactional
    public void delete(Long id) { repo.deleteById(id); }
}