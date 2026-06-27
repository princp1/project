package com.treasury.treasury.repository;

import com.treasury.treasury.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClaimRepos extends JpaRepository<Claim, Long> {
    List<Claim> findByUserId(Long userId);

    List<Claim> findByStatus(Claim.Status status);

    @Query("SELECT c FROM Claim c WHERE c.user.id = :userId ORDER BY c.createdAt DESC")
    List<Claim> findAllByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT c FROM Claim c ORDER BY c.createdAt DESC")
    List<Claim> findAllOrderByCreatedAtDesc();
}