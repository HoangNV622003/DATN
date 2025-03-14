package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByIdAndStatus(Long id, Integer status);

    List<Room> findAllByBoardingHouseIdAndStatus(Long boardingHouseId, Integer status);

    List<Room> findAllByBoardingHouseIdInAndStatus(List<Long> boardingHouseIdList, Integer status);

    boolean existsByNameAndBoardingHouseIdAndStatus(String name, Long boardingHouseId, Integer status);

    boolean existsByNameAndBoardingHouseIdAndStatusAndIdNot(String name, Long boardingHouseId, Integer status, Long id);
}
