package com.hbet.dto;

import lombok.Data;

import java.sql.Date;
import java.sql.Time;

@Data
public class RaceCreateDTO {
    private Date date;
    private Time time;
    private String location;
}
