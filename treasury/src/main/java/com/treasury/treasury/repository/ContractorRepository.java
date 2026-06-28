package com.treasury.treasury.repository;

import com.treasury.treasury.model.Contractor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ContractorRepository extends JpaRepository<Contractor, Long> {
    List<Contractor> findByNameContainingIgnoreCaseOrInnContaining(String n, String i);
    Optional<Contractor> findByInn(String inn);

    // Если нужно найти по названию
    Optional<Contractor> findByName(String name);
}