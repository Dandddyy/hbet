package com.hbet.dto;

import lombok.Data;

@Data
public class BetDTO {
    private Long betId;
    private Long userId;
    private Long betTypeId;
    private double amount;
    private String status;
    private double potential_win;
}
