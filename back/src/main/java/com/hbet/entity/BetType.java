package com.hbet.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "bet_type")
public class BetType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bet_type_id", nullable = false, updatable = false)
    private Long betTypeId;

    @Column(name = "race_id", nullable = false)
    private Long raceId;

    @Column(name = "horse_id", nullable = false)
    private Long horseId;

    @Column(name = "odd", nullable = false)
    private double odd;

    @Column(name = "is_first", nullable = false)
    private boolean is_first;
}
