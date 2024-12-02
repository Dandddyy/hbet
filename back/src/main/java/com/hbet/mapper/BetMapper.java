package com.hbet.mapper;

import com.hbet.dto.BetCreateDTO;
import com.hbet.dto.BetDTO;
import com.hbet.entity.Bet;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface BetMapper {
    BetMapper INSTANCE = Mappers.getMapper(BetMapper.class);

    BetDTO toBetDTO(Bet bet);

    Bet fromBetCreate(BetCreateDTO betCreateDTO);

}
