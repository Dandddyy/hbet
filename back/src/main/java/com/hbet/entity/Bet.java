package com.hbet.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "bet")
public class Bet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bet_id", nullable = false, updatable = false)
    private Long betId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "bet_type_id", nullable = false)
    private Long betTypeId;

    @Column(name = "amount", nullable = false)
    private double amount;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "potential_win", nullable = false)
    private double potential_win;
}