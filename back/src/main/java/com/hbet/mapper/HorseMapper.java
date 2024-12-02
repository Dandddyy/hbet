package com.hbet.mapper;

import com.hbet.dto.HorseDTO;
import com.hbet.entity.Horse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface HorseMapper {
    HorseMapper INSTANCE = Mappers.getMapper(HorseMapper.class);

    HorseDTO toHorseDTO(Horse horse);

}
