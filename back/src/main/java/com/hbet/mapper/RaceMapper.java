package com.hbet.mapper;

import com.hbet.dto.RaceCreateDTO;
import com.hbet.dto.RaceDTO;
import com.hbet.dto.ResultCreateDTO;
import com.hbet.entity.Race;
import com.hbet.entity.Result;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface RaceMapper {
    RaceMapper INSTANCE = Mappers.getMapper(RaceMapper.class);

    RaceDTO toRaceDTO(Race race);

    Race fromRaceCreate(RaceCreateDTO raceCreateDTO);

}
