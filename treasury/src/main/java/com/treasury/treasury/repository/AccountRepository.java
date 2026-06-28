package com.treasury.treasury.repository;

import com.treasury.treasury.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);

    // Если нужно найти по названию
    Optional<Account> findByName(String name);
}