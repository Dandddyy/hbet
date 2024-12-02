package com.hbet.repository;

import com.hbet.entity.Race;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RaceRepository extends JpaRepository<Race, Long> {
    @Query("SELECT r FROM Race r WHERE r.status = 'active'")
    List<Race> findAllActive();

    @Query("SELECT r FROM Race r WHERE r.status = 'end'")
    List<Race> findAllEnd();
}
