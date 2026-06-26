package com.treasury.treasury.repository;

import com.treasury.treasury.entity.Contractor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractorRepos extends JpaRepository<Contractor, Integer> {
    Contractor findByInn(String inn);
}