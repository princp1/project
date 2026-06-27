package com.treasury.treasury.repository;

import com.treasury.treasury.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SetAccountRepos extends JpaRepository<Account, Long> {
    List<Account> findByContractorId(Integer contractorId);
}