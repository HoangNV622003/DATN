package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.dto.response.RoomUser.RoomUserProjection;
import com.example.good_lodging_service.entity.Room;
import com.example.good_lodging_service.entity.RoomUser;
import com.example.good_lodging_service.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface RoomUserRepository extends JpaRepository<RoomUser, Long> {
    List<RoomUser> findAllByUserIdAndStatus(Long userId, Integer status);

    // get list user with roomId
    @Query(value = """
                SELECT u FROM RoomUser ru
                	INNER JOIN User u ON u.id=ru.userId
                    WHERE ru.status=:status AND u.status=:status AND ru.roomId=:roomId
            """)
    List<User> findAllByRoomIdAndStatusWithQuery(Long roomId, Integer status);

    boolean existsByUserIdAndRoomIdAndStatus(Long userId, Long roomId, Integer status);

    Optional<RoomUser> findByUserIdAndRoomIdAndStatus(Long userId, Long roomId, Integer status);

    @Query(nativeQuery = true, value = """
                SELECT
                	ru.user_id      as userId,
                	ru.room_id      as roomId,
                    bh.id           as boardingHouseId,
                    u.first_name    as firstName,
                    u.last_name     as lastName,
                    u.email         as email,
                    u.phone         as phoneNumber,
                    u.image_url     as imageUrl,
                    a.full_address  as address,
                    bh.name         as boardingHouseName,
                    bh.water_price  as waterPrice,
                    bh.electricity_price as electricityPrice,
                    bh.features     as features
                FROM room_user ru
                	INNER JOIN user u               ON u.id=ru.user_id
                    INNER JOIN room r               ON r.id=ru.room_id
                    INNER JOIN boarding_house bh    ON bh.id=r.boarding_house_id
                    INNER JOIN address a            ON a.id=bh.address_id
                WHERE ru.status= :status
                	AND u.status= :status
                    AND r.status= :status
                    AND a.status= :status
                    AND bh.status= :status
                    AND u.id=:userId
            """)
    Optional<RoomUserProjection> findByUserIdAndStatusWithQuery(Long userId, Integer status);
}
