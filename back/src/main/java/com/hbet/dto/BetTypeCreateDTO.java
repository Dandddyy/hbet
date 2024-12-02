package com.hbet.dto;

import lombok.Data;

@Data
public class BetTypeCreateDTO {
    private Long raceId;
    private Long horseId;
    private double odd;
    private boolean is_first;
}
