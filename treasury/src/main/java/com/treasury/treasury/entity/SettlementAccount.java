package com.treasury.treasury.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Расчетный_счет")
@Data
public class SettlementAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_счета")
    private Integer id;

    @Column(name = "Номер_счета")
    private String accountNumber;

    @Column(name = "Банк")
    private String bank;

    @Column(name = "Валюта")
    private String currency;

    @ManyToOne
    @JoinColumn(name = "ID_контрагента")
    private Contractor contractor;
}