package com.hbet.dto;

import lombok.Data;

@Data
public class HorseDTO {
    private Long horseId;
    private String name;
    private int age;
    private int wins;
    private int races;
}
