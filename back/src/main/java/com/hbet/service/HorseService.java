package com.hbet.service;

import com.hbet.dto.HorseDTO;
import com.hbet.entity.Horse;
import com.hbet.mapper.HorseMapper;
import com.hbet.repository.HorseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HorseService {
    private final HorseRepository horseRepository;
    private final HorseMapper mapper = HorseMapper.INSTANCE;

    public HorseDTO getHorse(Long id) {
        Optional<Horse> horse = horseRepository.findById(id);
        return horse.map(mapper::toHorseDTO).orElse(null);
    }

    public List<HorseDTO> getHorses() {
        List<Horse> horses = horseRepository.findAll();
        return horses.stream().map(mapper::toHorseDTO).toList();
    }

    public int updateHorse(Long id, HorseDTO horseToUpdate) {
        Optional<Horse> horseOptional = horseRepository.findById(id);
        if(horseOptional.isPresent()) {
            Optional<Horse> horse1 = horseRepository.findById(id);
            Horse horse2 = horse1.get();
            Horse horse = horseOptional.get();
            horse.setName(horse2.getName());
            horse.setAge(horse2.getAge());
            horse.setWins(horseToUpdate.getWins());
            horse.setRaces(horse2.getRaces());
            Horse updated = horseRepository.save(horse);
        }
        return horseOptional.isPresent() ? 1 : 0;
    }
}
