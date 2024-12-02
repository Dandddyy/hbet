package com.hbet.service;

import com.hbet.dto.UserCreateDTO;
import com.hbet.dto.UserDTO;
import com.hbet.entity.User;
import com.hbet.mapper.UserMapper;
import com.hbet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final UserMapper mapper = UserMapper.INSTANCE;

    public UserDTO getUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(mapper::toUserDTO).orElse(null);
    }

    public List<UserDTO> getUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(mapper::toUserDTO).toList();
    }

    public UserDTO createUser(UserCreateDTO userCreateDTO) {
        String encodedPassword = passwordEncoder.encode(userCreateDTO.getPassword());
        userCreateDTO.setPassword(encodedPassword);
        User user = mapper.fromUserCreate(userCreateDTO);
        user.setRole("user");
        User createdItem = userRepository.save(user);
        return mapper.toUserDTO(createdItem);
    }

    public int updateUser(Long id, UserDTO userToUpdate) {
        Optional<User> userOptional = userRepository.findById(id);
        if(userOptional.isPresent()) {
            Optional<User> user1 = userRepository.findById(id);
            User user2 = user1.get();
            User user = userOptional.get();
            user.setUserId(user2.getUserId());
            user.setName(userToUpdate.getName());
            user.setEmail(user2.getEmail());
            user.setPassword(user2.getPassword());
            user.setRole(user2.getRole());
            user.setMoney(userToUpdate.getMoney());
            User updated = userRepository.save(user);
        }
        return userOptional.isPresent() ? 1 : 0;
    }
}