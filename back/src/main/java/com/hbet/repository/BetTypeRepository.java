package com.hbet.repository;

import com.hbet.entity.BetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BetTypeRepository extends JpaRepository<BetType, Long> {
    @Query("SELECT b FROM BetType b WHERE b.raceId = :race_id")
    List<BetType> findAllByRaceId(Long race_id);

    @Query("SELECT b FROM BetType b WHERE b.raceId = :race_id AND b.horseId = :horse_id")
    List<BetType> findAllByRaceIdHorseId(Long race_id, Long horse_id);
}
