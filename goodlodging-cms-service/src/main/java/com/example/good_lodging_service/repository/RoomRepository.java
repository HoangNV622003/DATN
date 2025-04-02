package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.dto.response.Room.RoomConfigProjection;
import com.example.good_lodging_service.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query(nativeQuery = true, value = """
                SELECT
                    MAX(r.price) AS maxRent,
                    MIN(r.price) AS minRent,
                    MAX(r.area) AS maxArea,
                    MIN(r.area) AS minArea
                FROM room r
                INNER JOIN boarding_house bh ON bh.id = r.boarding_house_id 
                WHERE bh.id = :id AND bh.status = 1 AND r.status =1;
            """)
    Optional<RoomConfigProjection> findRoomConfigProjectionByBoardingHouseIdAndStatusWithQuery(@Param("id") Long id);

}
