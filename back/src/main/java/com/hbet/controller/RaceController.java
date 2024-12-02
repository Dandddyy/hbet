package com.hbet.controller;

import com.hbet.dto.RaceCreateDTO;
import com.hbet.dto.RaceDTO;
import com.hbet.service.RaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/race")
@RequiredArgsConstructor
public class RaceController {
    private final RaceService raceService;

    @GetMapping("/{id}")
    public ResponseEntity<RaceDTO> getRace(@PathVariable Long id) {
        RaceDTO race = raceService.getRace(id);
        if (race == null) {
            return ResponseEntity.notFound().build();
        }
        System.out.println(race);
        return ResponseEntity.ok(race);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateRace(@PathVariable Long id,
                                             @RequestBody RaceDTO raceToUpdate
    ) {
        int updatedRows = raceService.updateRace(id, raceToUpdate);
        if (updatedRows < 0) {
            return ResponseEntity.badRequest().build();
        } else if (updatedRows == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("{\"message\": \"Bet updated successfully\"}");
    }

    @GetMapping("/active")
    public ResponseEntity<List<RaceDTO>> getActiveRaces() {
        List<RaceDTO> race = raceService.getActiveRaces();
        if (race == null) {
            return ResponseEntity.badRequest().build();
        }
        System.out.println(race);
        return ResponseEntity.ok(race);
    }

    @GetMapping("/end")
    public ResponseEntity<List<RaceDTO>> getEndRaces() {
        List<RaceDTO> race = raceService.getEndRaces();
        if (race == null) {
            return ResponseEntity.badRequest().build();
        }
        System.out.println(race);
        return ResponseEntity.ok(race);
    }

    @GetMapping
    public ResponseEntity<List<RaceDTO>> getRaces() {
        List<RaceDTO> race = raceService.getRaces();
        if (race == null) {
            return ResponseEntity.badRequest().build();
        }
        System.out.println(race);
        return ResponseEntity.ok(race);
    }

    @PostMapping
    public ResponseEntity<RaceDTO> createRace(
            @RequestBody RaceCreateDTO raceToCreate
    ) {
        RaceDTO createdRace = raceService.createRace(raceToCreate);
        if (createdRace == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(createdRace);
    }
}
