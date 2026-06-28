package com.treasury.treasury.repository;

import com.treasury.treasury.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByClaimId(Long claimId);
}