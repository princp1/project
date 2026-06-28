package com.treasury.treasury.service;

import com.treasury.treasury.dto.AccountRequest;
import com.treasury.treasury.model.Account;
import com.treasury.treasury.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository repo;

    public List<Account> list() { return repo.findAll(); }
    public Account get(Long id) { return repo.findById(id).orElseThrow(); }

    @Transactional
    public Account create(AccountRequest r) {
        Account a = Account.builder()
                .name(r.getName()).accountNumber(r.getAccountNumber())
                .currency(r.getCurrency()).balance(r.getBalance()).bank(r.getBank())
                .build();
        return repo.save(a);
    }

    @Transactional
    public Account update(Long id, AccountRequest r) {
        Account a = get(id);
        a.setName(r.getName()); a.setAccountNumber(r.getAccountNumber());
        a.setCurrency(r.getCurrency()); a.setBalance(r.getBalance()); a.setBank(r.getBank());
        return repo.save(a);
    }

    @Transactional
    public void delete(Long id) { repo.deleteById(id); }
}