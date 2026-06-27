package com.treasury.treasury.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Заявка")
@Data
public class Claim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Номер_заявки")
    private Long id;

    @Column(name = "Дата_создания")
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(name = "Сумма")
    private BigDecimal amount;

    @Column(name = "Ставка_НДС")
    private Integer vatRate;

    @Column(name = "Статус")
    private String status;

    @ManyToOne
    @JoinColumn(name = "ID_пользователя")
    private User user;

    @ManyToOne
    @JoinColumn(name = "ID_контрагента")
    private Contractor contractor;
}