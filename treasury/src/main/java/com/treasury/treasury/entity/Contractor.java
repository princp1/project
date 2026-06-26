package com.treasury.treasury.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Контрагент")
@Data
public class Contractor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_контрагента")
    private Integer id;

    @Column(name = "Название")
    private String name;

    @Column(name = "Полное_название")
    private String fullName;

    @Column(name = "ИНН", unique = true)
    private String inn;

    @Column(name = "КПП")
    private String kpp;
}