package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findAllByRoomIdAndStatusNot(Long roomId, Integer status);
    Optional<Bill> findByIdAndStatusNot(Long id, Integer status);
    @Query(value = """
        SELECT pt FROM Bill pt
            INNER JOIN RoomUser ru ON pt.roomId = ru.id
            WHERE pt.status!=:status
            AND ru.userId=:userId
            AND ru.status!=:status
    """)
    List<Bill> findAllByUserIdAndStatusNotWithQuery(@Param("userId") Long userId, @Param("status") Integer status);
    Optional<Bill> findByIdAndStatus(Long id, Integer status);
}
