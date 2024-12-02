package com.hbet.controller;

import com.hbet.dto.*;
import com.hbet.service.BetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/bet")
@RequiredArgsConstructor
public class BetController {
    private final BetService betService;

    @GetMapping("/{id}")
    public ResponseEntity<List<BetDTO>> getBets(@PathVariable Long id) {
        List<BetDTO> bet = betService.getBets(id);
        if (bet == null) {
            return ResponseEntity.badRequest().build();
        }
        System.out.println(bet);
        return ResponseEntity.ok(bet);
    }

    @GetMapping("/list/{betTypeId}")
    public ResponseEntity<List<BetDTO>> getBetsByBetTypeId(@PathVariable Long betTypeId) {
        List<BetDTO> bet = betService.getBetsByBetTypeId(betTypeId);
        if (bet == null) {
            return ResponseEntity.badRequest().build();
        }
        System.out.println(bet);
        return ResponseEntity.ok(bet);
    }

    @PostMapping
    public ResponseEntity<BetDTO> createBet(
            @RequestBody BetCreateDTO betToCreate
    ) {
        BetDTO createdBet = betService.createBet(betToCreate);
        if (createdBet == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(createdBet);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBet(@PathVariable Long id,
            @RequestBody BetDTO betToUpdate
    ) {
        int updatedRows = betService.updateBet(id, betToUpdate);
        if (updatedRows < 0) {
            return ResponseEntity.badRequest().build();
        } else if (updatedRows == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
