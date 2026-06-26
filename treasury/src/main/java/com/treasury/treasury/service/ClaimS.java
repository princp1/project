package com.treasury.treasury.service;

import com.treasury.treasury.entity.Claim;
import com.treasury.treasury.entity.User;
import com.treasury.treasury.entity.Contractor;
import com.treasury.treasury.repository.ClaimRepos;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClaimS {
    private final ClaimRepos repository;

    public ClaimS(ClaimRepos repository) {
        this.repository = repository;
    }

    public List<Claim> getAll() {
        return repository.findAll();
    }

    public List<Claim> getByUser(Integer userId) {
        return repository.findByUserId(userId);
    }

    public Claim getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public Claim create(Claim claim, User user, Contractor contractor) {
        claim.setUser(user);
        claim.setContractor(contractor);
        claim.setStatus("NEW");
        claim.setCreatedDate(LocalDateTime.now());
        return repository.save(claim);
    }

    // согласование директора
    public Claim approve(Integer id) {
        Claim claim = getById(id);
        if (claim != null && "NEW".equals(claim.getStatus())) {
            claim.setStatus("APPROVED");
            return repository.save(claim);
        }
        return claim;
    }

    // Отклонение директором  +++++++++++++++++++++++++++++++Добавить логику отправки комментария
    public Claim reject(Integer id, String comment) {
        Claim claim = getById(id);
        if (claim != null && "NEW".equals(claim.getStatus())) {
            claim.setStatus("REJECTED");
            return repository.save(claim);
        }
        return claim;
    }

    // Согласование ФинМенеджера
    public Claim pay(Integer id) {
        Claim claim = getById(id);
        if (claim != null && "APPROVED".equals(claim.getStatus())) {
            claim.setStatus("PAID");
            return repository.save(claim);
        }
        return claim;
    }

    // Отказ ФинМенеджера
    public Claim rejectByFinManager(Integer id, String comment) {
        Claim claim = getById(id);
        if (claim != null && "APPROVED".equals(claim.getStatus())) {
            claim.setStatus("REJECTED");
            return repository.save(claim);
        }
        return claim;
    }
}