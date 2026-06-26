package com.treasury.treasury.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Файл")
@Data
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_файла")
    private Integer id;

    @Column(name = "Имя_файла")
    private String fileName;

    @Column(name = "Путь")
    private String path;

    @Column(name = "Расширение")
    private String extension;

    @Column(name = "Размер")
    private Long size;

    @Column(name = "Дата_загрузки")
    private LocalDateTime uploadDate = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "Номер_заявки")
    private Claim claim;
}