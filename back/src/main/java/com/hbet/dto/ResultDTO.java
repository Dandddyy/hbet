package com.hbet.dto;

import lombok.Data;

@Data
public class ResultDTO {
    private Long resultId;
    private Long raceId;
    private Long horseId;
    private int position;
}
