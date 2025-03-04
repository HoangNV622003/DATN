package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.entity.BoardingHouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardingHouseRepository extends JpaRepository<BoardingHouse, Long> {
    Optional<BoardingHouse> findByIdAndStatus(Long boardingHouseId,Integer status);
    List<BoardingHouse> findAllByIdInAndStatus(List<Long> boardingHouseIdList,Integer status);
    List<BoardingHouse> findAllByUserIdAndStatus(Long userId,Integer status);
    boolean existsByNameAndUserIdAndStatus(String name, Long userId, Integer status);
    boolean existsByNameAndUserIdAndStatusAndIdNot(String name, Long userId, Integer status, Long id);

}
