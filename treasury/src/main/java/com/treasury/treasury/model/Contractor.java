package com.treasury.treasury.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contractors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contractor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;   // "Общество с ограниченной ответственностью ..."

    @Column(nullable = false, length = 9)
    private String kpp;        // КПП — 9 цифр

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String inn;

    @Column(nullable = false)
    private String bankAccount;

    private String address;

    private String phone;

    private String email;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}