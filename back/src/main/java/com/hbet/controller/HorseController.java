package com.hbet.controller;

import com.hbet.dto.*;
import com.hbet.service.HorseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/horse")
@RequiredArgsConstructor
public class HorseController {
    private final HorseService horseService;

    @GetMapping("/{id}")
    public ResponseEntity<HorseDTO> getHorse(@PathVariable Long id) {
        HorseDTO horse = horseService.getHorse(id);
        if (horse == null) {
            return ResponseEntity.notFound().build();
        }
        System.out.println(horse);
        return ResponseEntity.ok(horse);
    }

    @GetMapping
    public ResponseEntity<List<HorseDTO>> getHorses() {
        List<HorseDTO> horse = horseService.getHorses();
        if (horse == null) {
            return ResponseEntity.badRequest().build();
        }
        System.out.println(horse);
        return ResponseEntity.ok(horse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateHorse(@PathVariable Long id,
                                          @RequestBody HorseDTO horseToUpdate
    ) {
        int updatedRows = horseService.updateHorse(id, horseToUpdate);
        if (updatedRows < 0) {
            return ResponseEntity.badRequest().build();
        } else if (updatedRows == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
