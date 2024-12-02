package com.hbet.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "horse")
public class Horse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "horse_id", nullable = false, updatable = false)
    private Long horseId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "age", nullable = false)
    private int age;

    @Column(name = "wins", nullable = false)
    private int wins;

    @Column(name = "reces", nullable = false)
    private int races;
}
