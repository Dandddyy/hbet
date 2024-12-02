package com.hbet.dto;

import lombok.Data;

import java.sql.Date;
import java.sql.Time;

@Data
public class RaceDTO {
    private Long raceId;
    private Date date;
    private Time time;
    private String location;
    private String status;
}
