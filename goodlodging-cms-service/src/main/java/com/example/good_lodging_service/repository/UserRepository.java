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

    List<User> findAllByStatus(Integer status, Pageable pageable);
}