package com.treasury.treasury.repository;

import com.treasury.treasury.model.Claim;
import com.treasury.treasury.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findAllByOrderByCreatedAtDesc();
    List<Claim> findByUserOrderByCreatedAtDesc(User user);
    long count(); // для генерации claimNumber
}