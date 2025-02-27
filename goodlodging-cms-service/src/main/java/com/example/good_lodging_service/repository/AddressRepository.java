package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    boolean existsByHouseNumberAndStreetNameAndWardsIdAndDistrictIdAndProvinceIdAndStatus(Integer houseNumber, String streetName, Long wardsId, Long districtId, Long provinceId, Integer status);
    boolean existsByHouseNumberAndStreetNameAndWardsIdAndDistrictIdAndProvinceIdAndStatusAndIdNot(Integer houseNumber, String streetName, Long wardsId, Long districtId, Long provinceId, Integer status, Long id);

}
