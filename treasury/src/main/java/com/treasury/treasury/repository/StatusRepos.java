package com.treasury.treasury.repository;

import com.treasury.treasury.entity.StatusClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusRepos extends JpaRepository<StatusClaim, Integer> {
}