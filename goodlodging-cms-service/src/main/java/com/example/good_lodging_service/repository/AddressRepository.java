package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.dto.response.Address.AddressDetailProjection;
import com.example.good_lodging_service.dto.response.Address.AddressDetailResponse;
import com.example.good_lodging_service.dto.response.Address.AddressProjection;
import com.example.good_lodging_service.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    boolean existsByHouseNumberAndStreetNameAndWardsIdAndDistrictIdAndProvinceIdAndBoardingHouseIdAndStatus(Integer houseNumber, String streetName, Long wardsId, Long districtId, Long provinceId, Long boardingHouseId, Integer status);

    boolean existsByHouseNumberAndStreetNameAndWardsIdAndDistrictIdAndProvinceIdAndBoardingHouseIdAndStatusAndIdNot(Integer houseNumber, String streetName, Long wardsId, Long districtId, Long provinceId, Long boardingHouseId, Integer status, Long id);

    @Query(nativeQuery = true, value = """
                SELECT
                    bh.id as boardingHouseId,
                    a.id as addressId,
                    a.full_address as fullAddress
                FROM boarding_house bh
                    JOIN address a ON bh.id = a.boarding_house_id
                WHERE bh.id IN :ids AND a.status=1;
                ;
            """)
    List<AddressProjection> findAllByBoardingHouseIdInWithQuery(@Param("ids")List<Long> ids);
    List<Address> findAllByBoardingHouseIdIn(List<Long> ids);
    Address findByBoardingHouseIdAndStatus(Long boardingHouseId, Integer status);
    Optional<Address> findByIdAndStatus(Long id, Integer status);

    boolean existsByIdAndStatus(Long id, Integer status);
    @Query(nativeQuery = true,value = """
                SELECT
                    	w.wards_id      AS wardsId,
                    	w.name          AS wardsName,
                        d.district_id   AS districtId,
                        d.name          AS districtName,
                        p.province_id   AS provinceId,
                        p.name          AS provinceName
                    FROM wards w
                    INNER JOIN district d ON w.district_id=d.district_id
                    INNER JOIN province p ON d.province_id=p.province_id
            """)
    List<AddressDetailProjection> findAllByQuery();
}
