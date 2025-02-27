package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.entity.BoardingHouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardingHouseRepository extends JpaRepository<BoardingHouse, Long> {
}
