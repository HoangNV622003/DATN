package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.dto.response.Address.AddressPresentation;
import com.example.good_lodging_service.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
                    a.province_id as provinceId,
                    a.district_id as districtId,
                    a.wards_id as wardsId,
                    a.street_name as streetName,
                    a.house_number as houseNumber
                FROM boarding_house bh
                    JOIN address a ON bh.address_id = a.id
                    JOIN province p ON p.province_id=a.province_id
                    JOIN district d ON d.district_id=a.district_id
                    JOIN wards w ON w.wards_id=a.wards_id
                WHERE bh.id IN :ids AND a.status=1;
                ;
            """)
    List<AddressPresentation> findAllByBoardingHouseIdInWithQuery(List<Long> ids);

    @Query(nativeQuery = true, value = """
                SELECT a.* FROM address a 
                    JOIN boarding_house bh ON bh.id = a.boarding_house_id
                    WHERE bh.id = :boardingHouseId AND bh.status = :status LIMIT 1;
            """)
    Address findByBoardingHouseIdAndStatusWithQuery(Long boardingHouseId, Integer status);

    Optional<Address> findByIdAndStatus(Long id, Integer status);

    boolean existsByIdAndStatus(Long id, Integer status);
}
