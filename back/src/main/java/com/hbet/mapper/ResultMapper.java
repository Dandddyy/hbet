package com.hbet.mapper;

import com.hbet.dto.ResultCreateDTO;
import com.hbet.dto.ResultDTO;
import com.hbet.entity.Result;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ResultMapper {
    ResultMapper INSTANCE = Mappers.getMapper(ResultMapper.class);

    ResultDTO toResultDTO(Result result);

    Result fromResultCreate(ResultCreateDTO resultCreateDTO);

}
