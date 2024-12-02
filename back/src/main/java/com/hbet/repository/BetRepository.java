package com.hbet.repository;

import com.hbet.entity.Bet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BetRepository extends JpaRepository<Bet, Long> {
    @Query("SELECT b FROM Bet b WHERE b.userId = :user_id")
    List<Bet> findAllByUserId(Long user_id);

    @Query("SELECT b FROM Bet b WHERE b.betTypeId = :betType_id")
    List<Bet> findAllByBetTypeId(Long betType_id);
}
