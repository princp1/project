package com.treasury.treasury.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Статус_заявки")
@Data
public class StatusClaim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_статуса")
    private Integer id;

    @Column(name = "Название")
    private String name;

    @Column(name = "Описание")
    private String description;
}