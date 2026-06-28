package com.treasury.treasury.service;

import com.treasury.treasury.model.Attachment;
import com.treasury.treasury.model.Claim;
import com.treasury.treasury.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private static final Set<String> ALLOWED = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/png"
    );

    private final AttachmentRepository repo;

    @Value("${app.upload-dir}")
    private String uploadDir;

    public Attachment save(Claim claim, MultipartFile file) throws IOException {
        if (!ALLOWED.contains(file.getContentType())) {
            throw new RuntimeException("Недопустимый тип файла: " + file.getContentType());
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("Файл больше 10 МБ");
        }
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        String stored = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path target = dir.resolve(stored);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        Attachment a = Attachment.builder()
                .claim(claim)
                .originalFilename(file.getOriginalFilename())
                .contentType(file.getContentType())
                .sizeBytes(file.getSize())
                .storagePath(target.toString())
                .build();
        return repo.save(a);
    }
}