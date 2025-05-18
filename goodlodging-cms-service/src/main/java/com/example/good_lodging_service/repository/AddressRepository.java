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
    @Query(nativeQuery = true, value = """
                SELECT
                    bh.id as boardingHouseId,
                    a.id as addressId,
                    a.full_address as fullAddress
                FROM boarding_house bh
                    JOIN address a ON bh.address_id = a.id
                WHERE bh.id IN :ids AND a.status=1;
                ;
            """)
    List<AddressProjection> findAllByBoardingHouseIdInWithQuery(@Param("ids") List<Long> ids);

    Optional<Address> findByIdAndStatus(Long id, Integer status);
    @Query(nativeQuery = true, value = """
        SELECT a.* FROM address a
        	INNER JOIN boarding_house b\s
            ON b.address_id=a.id AND b.status=:status AND a.status=:status
            WHERE b.id=:id
    """)
    Optional<Address> findByBoardingHouseIdAndStatusWithQuery(@Param("id")Long boardingHouseId,@Param("status") Integer status);
    @Query(nativeQuery = true, value = """
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
