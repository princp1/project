package com.treasury.treasury.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Пользователь")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_пользователя")
    private Integer id;

    @Column(name = "Логин", nullable = false, unique = true)
    private String login;

    @Column(name = "Пароль", nullable = false)
    private String password;

    @Column(name = "ФИО")
    private String fullName;

    @Column(name = "Роль")
    private String role;
}
