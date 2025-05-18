package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndStatus(String username, Integer status);
    Optional<User> findByIdAndStatus(Long id, Integer status);
    List<User> findAllByIdInAndStatus(List<Long> ids, Integer status);
    @Query(nativeQuery = true, value = """
                SELECT EXISTS (
                    SELECT 1 FROM user u 
                    WHERE (u.username = :username OR u.email = :email OR u.phone = :phone) 
                          AND u.status = :status 
                )
            """)
    Integer existByUsernameOrEmailOrPhoneWithQuery(
            @Param("username") String username,
            @Param("email") String email,
            @Param("phone") String phone,
            @Param("status") Integer status);

    @Query(nativeQuery = true, value = """
                SELECT EXISTS (
                    SELECT 1 FROM user u 
                    WHERE (u.email = :email OR u.phone = :phone) 
                          AND u.status = :status 
                          AND u.id <> :id
                )
            """)
    Integer existsByEmailOrPhoneAndIdNotWithQuery(@Param("email") String email,
                                                  @Param("phone") String phone,
                                                  @Param("status") Integer status,
                                                  @Param("id") Long id);
    @Query(value = "SELECT u FROM User u INNER JOIN RoomUser ru ON ru.userId=u.id WHERE ru.roomId=:roomId AND ru.status=:status AND u.status=:status")
    List<User> findAllByRoomIdAndStatusWithQuery(@Param("roomId")Long roomId,@Param("status")Integer status);
    List<User> findAllByStatus(Integer status, Pageable pageable);
    Optional<User> findByEmailAndStatus(String email, Integer status);
    @Query(value = """
        SELECT u FROM User u
            INNER JOIN BoardingHouse bh ON bh.userId=u.id
            INNER JOIN Room r ON r.boardingHouseId=bh.id
        WHERE r.status=:status AND r.id=:id
    """)
    Optional<User> findByRoomIdAndStatusWithQuery(@Param("id")Long id,@Param("status") Integer status);
}