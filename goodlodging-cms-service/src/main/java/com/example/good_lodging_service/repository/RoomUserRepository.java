package com.example.good_lodging_service.repository;

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

    Optional<RoomUser> findByUserIdAndRoomIdAndStatus(Long userId, Long roomId, Integer status);
}
