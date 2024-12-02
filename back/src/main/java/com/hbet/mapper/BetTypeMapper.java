package com.hbet.mapper;

import com.hbet.dto.BetTypeCreateDTO;
import com.hbet.dto.BetTypeDTO;
import com.hbet.entity.BetType;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface BetTypeMapper {
    BetTypeMapper INSTANCE = Mappers.getMapper(BetTypeMapper.class);

    BetTypeDTO toBetTypeDTO(BetType betType);

    BetType fromBetTypeCreate(BetTypeCreateDTO betTypeCreateDTO);

}
