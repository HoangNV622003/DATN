package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findAllByRoomIdAndStatusNot(Long roomId, Integer status);
    Optional<PaymentTransaction> findByIdAndStatusNot(Long id, Integer status);
    @Query(value = """
        SELECT pt FROM PaymentTransaction pt
            INNER JOIN RoomUser ru ON pt.roomId = ru.id
            WHERE pt.status!=:status
            AND ru.userId=:userId
            AND ru.status!=:status
    """)
    List<PaymentTransaction> findAllByUserIdAndStatusNotWithQuery(@Param("userId") Long userId,@Param("status") Integer status);
    Optional<PaymentTransaction> findByIdAndStatus(Long id, Integer status);
}
