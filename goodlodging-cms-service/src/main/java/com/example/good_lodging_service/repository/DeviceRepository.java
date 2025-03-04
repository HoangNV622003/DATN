package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    Optional<Device> findByIdAndStatus(Long id,Integer status);
    List<Device> findAllByStatus(Integer status);
    boolean existsByNameAndStatus(String name,Integer status);
    boolean existsByNameAndStatusAndIdNot(String name,Integer status,Long id);

}
