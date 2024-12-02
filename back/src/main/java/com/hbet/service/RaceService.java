package com.hbet.service;

import com.hbet.dto.RaceCreateDTO;
import com.hbet.dto.RaceDTO;
import com.hbet.entity.Race;
import com.hbet.mapper.RaceMapper;
import com.hbet.repository.RaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RaceService {
    private final RaceRepository raceRepository;
    private final RaceMapper mapper = RaceMapper.INSTANCE;

    public RaceDTO getRace(Long id) {
        Optional<Race> race = raceRepository.findById(id);
        return race.map(mapper::toRaceDTO).orElse(null);
    }

    public List<RaceDTO> getActiveRaces() {
        List<Race> race = raceRepository.findAllActive();
        return race.stream().map(mapper::toRaceDTO).toList();
    }

    public List<RaceDTO> getEndRaces() {
        List<Race> race = raceRepository.findAllEnd();
        return race.stream().map(mapper::toRaceDTO).toList();
    }

    public List<RaceDTO> getRaces() {
        List<Race> race = raceRepository.findAll();
        return race.stream().map(mapper::toRaceDTO).toList();
    }

    public int updateRace(Long id, RaceDTO raceToUpdate) {
        Optional<Race> raceOptional = raceRepository.findById(id);
        if(raceOptional.isPresent()) {
            Optional<Race> race1 = raceRepository.findById(id);
            Race race2 = race1.get();
            Race race = raceOptional.get();
            race.setDate(race2.getDate());
            race.setTime(race2.getTime());
            race.setLocation(race2.getLocation());
            race.setStatus(raceToUpdate.getStatus());
            Race updated = raceRepository.save(race);
        }
        return raceOptional.isPresent() ? 1 : 0;
    }

    public RaceDTO createRace(RaceCreateDTO raceCreateDTO) {
        Race race = mapper.fromRaceCreate(raceCreateDTO);
        race.setStatus("none");
        Race createdItem = raceRepository.save(race);
        return mapper.toRaceDTO(createdItem);
    }
}
