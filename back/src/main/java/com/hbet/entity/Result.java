package com.hbet.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "result")
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id", nullable = false, updatable = false)
    private Long resultId;

    @Column(name = "race_id", nullable = false)
    private Long raceId;

    @Column(name = "horse_id", nullable = false)
    private Long horseId;

    @Column(name = "position", nullable = false)
    private int position;
}
