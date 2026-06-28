package com.treasury.treasury.controller;

import com.treasury.treasury.model.Attachment;
import com.treasury.treasury.model.Claim;
import com.treasury.treasury.model.User;
import com.treasury.treasury.repository.AttachmentRepository;
import com.treasury.treasury.service.ClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentRepository repo;
    private final ClaimService claimService;

    @GetMapping("/{id}")
    public ResponseEntity<Resource> download(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Attachment a = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Файл не найден"));
        // проверка доступа через getFor
        Claim claim = claimService.getFor(user, a.getClaim().getId());

        FileSystemResource res = new FileSystemResource(Path.of(a.getStoragePath()));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(a.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + a.getOriginalFilename() + "\"")
                .body(res);
    }
}