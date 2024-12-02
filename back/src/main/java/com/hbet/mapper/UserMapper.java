package com.hbet.mapper;

import com.hbet.dto.UserCreateDTO;
import com.hbet.dto.UserDTO;
import com.hbet.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO toUserDTO(User user);

    User fromUserCreate(UserCreateDTO userCreateDTO);
}
