package com.treasury.treasury.repository;

import com.treasury.treasury.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepos extends JpaRepository<File, Long> {
    List<File> findByClaimId(Integer claimId);
}