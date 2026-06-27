package com.treasury.treasury.service;

import com.treasury.treasury.dto.AccountResponse;
import com.treasury.treasury.model.Account;
import com.treasury.treasury.repository.SetAccountRepos;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SetAccountS {

    private final SetAccountRepos accountRepository;

    public List<AccountResponse> getAll() {
        return accountRepository.findAll().stream()
                .map(AccountResponse::from)
                .collect(Collectors.toList());
    }

    public AccountResponse getById(Long id) {
        return accountRepository.findById(id)
                .map(AccountResponse::from)
                .orElseThrow(() -> new RuntimeException("Счёт не найден"));
    }

    public void updateBalance(Long id, BigDecimal newBalance) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Счёт не найден"));
        account.setBalance(newBalance);
        accountRepository.save(account);
    }

    public void subtractBalance(Long id, BigDecimal amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Счёт не найден"));
        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);
    }
}