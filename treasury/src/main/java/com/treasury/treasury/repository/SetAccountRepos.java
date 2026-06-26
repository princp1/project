package com.treasury.treasury.repository;

import com.treasury.treasury.entity.SettlementAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SetAccountRepos extends JpaRepository<SettlementAccount, Integer> {
    List<SettlementAccount> findByContractorId(Integer contractorId);
}