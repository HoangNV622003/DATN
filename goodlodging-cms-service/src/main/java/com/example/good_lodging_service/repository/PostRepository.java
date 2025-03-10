package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.dto.response.Post.PostDetailProjection;
import com.example.good_lodging_service.dto.response.Post.PostProjection;
import com.example.good_lodging_service.entity.Post;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@Transactional
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findByIdAndStatus(Long id, int value);
        @Query(nativeQuery = true,
        value = """
            SELECT DISTINCT 
            p.id                AS id,
            p.title             AS title,
            p.area              AS area,
            p.room_rent         AS roomRent,
            p.user_id           AS userId,
            p.image_url         AS imageUrl,
            p.address           AS address,
            p.boarding_house_id AS boardingHouseId,
            p.date_updated      AS modifiedDate
        FROM post p WHERE p.status=:status
        """,
        countQuery = """
            SELECT COUNT(DISTINCT p.id )
            FROM post p WHERE p.status=:status
        """)
    Page<PostProjection> findAllByStatusWithQuery(@Param("status")Integer status, Pageable pageable);
    @Query(nativeQuery = true,
            value = """
            SELECT DISTINCT 
            p.id                AS id,
            p.title             AS title,
            p.area              AS area,
            p.room_rent         AS roomRent,
            p.user_id           AS userId,
            p.image_url         AS imageUrl,
            p.address           AS address,
            p.boarding_house_id AS boardingHouseId,
            p.date_updated      AS modifiedDate

        FROM post p WHERE p.status=:status AND p.user_id=:userId
        """,
            countQuery = """
            SELECT COUNT(DISTINCT p.id )
            FROM post p WHERE p.status=:status AND p.user_id=:userId
        """)
    Page<PostProjection> findAllByUserIdAndStatusWithQuery(@Param("userId")Long userId,@Param("status") Integer status, Pageable pageable);
    @Query(nativeQuery = true,
            value = """
        SELECT DISTINCT 
            p.id                AS id,
            p.title             AS title,
            p.area              AS area,
            p.room_rent         AS roomRent,
            p.user_id           AS userId,
            p.image_url         AS imageUrl,
            p.address           AS address,
            p.boarding_house_id AS boardingHouseId,
            p.date_updated      AS modifiedDate
        FROM
            post p
        INNER JOIN
            boarding_house bh ON p.boarding_house_id = bh.id AND bh.status=1
        INNER JOIN
            address a ON bh.id = a.boarding_house_id AND a.status=1
        WHERE
            p.status = 1
            -- Lọc theo địa chỉ
            AND (a.wards_id = :wardsId OR :wardsId IS NULL OR :wardsId = '')
            AND (a.district_id = :districtId OR :districtId IS NULL OR :districtId = '')
            AND (a.province_id = :provinceId OR :provinceId IS NULL OR :provinceId = '')
            -- Lọc theo các tiêu chí khác
            AND (p.room_rent BETWEEN COALESCE(:minRoomRent, p.room_rent) AND COALESCE(:maxRoomRent, p.room_rent))
            AND (p.area BETWEEN COALESCE(:minArea, p.area) AND COALESCE(:maxArea, p.area))
            AND (bh.electricity_price BETWEEN COALESCE(:minElectricityPrice, bh.electricity_price) 
                                      AND COALESCE(:maxElectricityPrice, bh.electricity_price))
            AND (bh.water_price BETWEEN COALESCE(:minWaterPrice, bh.water_price) 
                                  AND COALESCE(:maxWaterPrice, bh.water_price))
            AND (bh.features LIKE '%' || COALESCE(:features, bh.features) || '%')
            AND (bh.description LIKE '%' || COALESCE(:description, bh.description) || '%')
        """,
            countQuery = """
        SELECT COUNT(DISTINCT p.id)
        FROM
            post p
        INNER JOIN
            boarding_house bh ON p.boarding_house_id = bh.id AND bh.status=1
        INNER JOIN
            address a ON bh.id = a.boarding_house_id AND a.status=1
        WHERE
            p.status = 1
            AND (a.wards_id = :wardsId OR :wardsId IS NULL OR :wardsId = '')
            AND (a.district_id = :districtId OR :districtId IS NULL OR :districtId = '')
            AND (a.province_id = :provinceId OR :provinceId IS NULL OR :provinceId = '')
            AND (p.room_rent BETWEEN COALESCE(:minRoomRent, p.room_rent) AND COALESCE(:maxRoomRent, p.room_rent))
            AND (p.area BETWEEN COALESCE(:minArea, p.area) AND COALESCE(:maxArea, p.area))
            AND (bh.electricity_price BETWEEN COALESCE(:minElectricityPrice, bh.electricity_price) 
                                      AND COALESCE(:maxElectricityPrice, bh.electricity_price))
            AND (bh.water_price BETWEEN COALESCE(:minWaterPrice, bh.water_price) 
                                  AND COALESCE(:maxWaterPrice, bh.water_price))
            AND (bh.features LIKE '%' || COALESCE(:features, bh.features) || '%')
            AND (bh.description LIKE '%' || COALESCE(:description, bh.description) || '%')
        """
    )
    Page<PostProjection> findAllByAddressAndFeaturesWithQuery(
            @Param("provinceId") Long provinceId,
            @Param("districtId") Long districtId,
            @Param("wardsId") Long wardsId,
            @Param("minRoomRent") Float minRoomRent,
            @Param("maxRoomRent") Float maxRoomRent,
            @Param("minArea") Float minArea,
            @Param("maxArea") Float maxArea,
            @Param("minElectricityPrice") Float minElectricityPrice,
            @Param("maxElectricityPrice") Float maxElectricityPrice,
            @Param("minWaterPrice") Float minWaterPrice,
            @Param("maxWaterPrice") Float maxWaterPrice,
            @Param("features") String features,
            @Param("description") String description,
            Pageable pageable);
    @Query(nativeQuery = true,value = """
            
            SELECT
                p.id AS postId,
                p.user_id AS userId,
                p.address AS address,
                p.title AS title,
                CONCAT(u.first_name,' ',u.last_name) AS fullname,
                u.url_avatar AS urlAvatar,
                u.email AS email,
                u.phone AS phoneNumber,
                r.area AS area,
                r.floor AS floor,
                bh.id AS boardingHouseId,
                bh.name as boardingHouseName,
                bh.features AS features,
                bh.description AS description,
                bh.room_rent AS roomRent,
                bh.water_price AS waterPrice,
                bh.electricity_price AS electricityPrice,
                p.date_updated as modifiedDate
            FROM post p
            INNER JOIN user u ON p.user_id=u.id AND u.status=:status
            INNER JOIN boarding_house bh ON bh.id=p.boarding_house_id AND bh.status=:status
            INNER JOIN room r ON r.id=p.room_id AND r.status=:status
            WHERE p.id=:postId AND p.status=:status
            """)
    Optional<PostDetailProjection> findByPostIdAndStatusWithQuery(@Param("postId")Long postId,@Param("status") Integer status);
}

