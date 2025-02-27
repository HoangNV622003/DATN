package com.example.good_lodging_service.repository;


import com.example.good_lodging_service.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface OTPRepository extends JpaRepository<OTP,Long> {
    Optional<OTP> findByEmail(String email);
    Optional<OTP> findByPhoneNumber(String phoneNumber);
    Optional<OTP> findFirstByEmailOrderByExpiryTimeDesc(String email);
    @Modifying
    void deleteAllByEmail(String email);
}
