package com.treasury.treasury.repository;

import com.treasury.treasury.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepos extends JpaRepository<Claim, Integer> {
    List<Claim> findByUserId(Integer userId);
}