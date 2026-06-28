package com.treasury.treasury.controller;

import com.treasury.treasury.dto.ApiResponse;
import com.treasury.treasury.model.User;
import com.treasury.treasury.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping
    public ResponseEntity<?> all(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getByUserId(user.getId())));
    }

    @GetMapping("/unread")
    public ResponseEntity<?> unread(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(service.getUnreadByUserId(user.getId())));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> read(@PathVariable Long id) {
        service.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.ok("OK", null));
    }

    @PostMapping("/read-all")
    public ResponseEntity<?> readAll(@AuthenticationPrincipal User user) {
        service.markAllAsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("OK", null));
    }
}