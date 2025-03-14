package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.entity.RoomUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomUserRepository extends JpaRepository <RoomUser, Long>{
    List<RoomUser> findAllByUserIdAndStatus(Long userId, Integer status);
}
