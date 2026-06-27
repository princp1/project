package com.treasury.treasury.service;

import com.treasury.treasury.dto.ContractorRequest;
import com.treasury.treasury.dto.ContractorResponse;
import com.treasury.treasury.model.Contractor;
import com.treasury.treasury.repository.ContractorRepos;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractorS {

    private final ContractorRepos contractorRepository;

    public List<ContractorResponse> getAll() {
        return contractorRepository.findAll().stream()
                .map(ContractorResponse::from)
                .collect(Collectors.toList());
    }
    public Contractor getEntityById(Long id) {
        return contractorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Контрагент не найден"));
    }
    public ContractorResponse getById(Long id) {
        return contractorRepository.findById(id)
                .map(ContractorResponse::from)
                .orElseThrow(() -> new RuntimeException("Контрагент не найден"));
    }

    @Transactional
    public ContractorResponse create(ContractorRequest request) {
        Contractor contractor = Contractor.builder()
                .name(request.getName())
                .inn(request.getInn())
                .bankAccount(request.getBankAccount())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .build();

        contractor = contractorRepository.save(contractor);
        return ContractorResponse.from(contractor);
    }

    @Transactional
    public ContractorResponse update(Long id, ContractorRequest request) {
        Contractor contractor = contractorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Контрагент не найден"));

        contractor.setName(request.getName());
        contractor.setInn(request.getInn());
        contractor.setBankAccount(request.getBankAccount());
        contractor.setAddress(request.getAddress());
        contractor.setPhone(request.getPhone());
        contractor.setEmail(request.getEmail());

        contractor = contractorRepository.save(contractor);
        return ContractorResponse.from(contractor);
    }

    public void delete(Long id) {
        contractorRepository.deleteById(id);
    }
}