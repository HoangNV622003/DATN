package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.dto.response.Post.PostDetailProjection;
import com.example.good_lodging_service.dto.response.Post.PostProjection;
import com.example.good_lodging_service.entity.Post;
import com.example.good_lodging_service.entity.Room;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
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
                         p.max_area              AS maxArea,
                        p.min_area AS minArea,
                        p.max_rent         AS maxRent,
                        p.min_rent         AS minRent,
                        p.user_id           AS userId,
                        p.image_url         AS imageUrl,
                        p.address           AS address,
                        p.boarding_house_id AS boardingHouseId,
                        p.date_updated      AS modifiedDate,
                        p.type AS type
                    
                    FROM post p WHERE p.status=:status
                    """,
            countQuery = """
                        SELECT COUNT(DISTINCT p.id )
                        FROM post p WHERE p.status=:status
                    """)
    Page<PostProjection> findAllByStatusWithQuery(@Param("status") Integer status, Pageable pageable);

    @Query(nativeQuery = true,
            value = """
                        SELECT DISTINCT 
                        p.id                AS id,
                        p.title             AS title,
                        p.max_area              AS maxArea,
                        p.min_area AS minArea,
                        p.max_rent         AS maxRent,
                        p.min_rent         AS minRent,
                        p.user_id           AS userId,
                        p.image_url         AS imageUrl,
                        p.address           AS address,
                        p.boarding_house_id AS boardingHouseId,
                        p.date_updated      AS modifiedDate,
                        p.type AS type
                    
                    FROM post p WHERE p.status=:status AND p.user_id=:userId
                    """,
            countQuery = """
                        SELECT COUNT(DISTINCT p.id )
                        FROM post p WHERE p.status=:status AND p.user_id=:userId
                    """)
    Page<PostProjection> findAllByUserIdAndStatusWithQuery(@Param("userId") Long userId, @Param("status") Integer status, Pageable pageable);

    @Query(nativeQuery = true,
            value = """
                    SELECT DISTINCT 
                        p.id                AS id,
                        p.title             AS title,
                        p.max_area              AS maxArea,
                        p.min_area AS minArea,
                        p.max_rent         AS maxRent,
                        p.min_rent         AS minRent,
                        p.user_id           AS userId,
                        p.image_url         AS imageUrl,
                        p.address           AS address,
                        p.boarding_house_id AS boardingHouseId,
                        p.date_updated      AS modifiedDate,
                        p.type AS type
                    FROM
                        post p
                    INNER JOIN
                        boarding_house bh ON p.boarding_house_id = bh.id AND bh.status=1
                    INNER JOIN
                        address a ON bh.id = a.boarding_house_id AND a.status=1
                    WHERE
                        p.status = 1
                        -- Lọc theo địa chỉ
                        AND (a.wards_id IN :wardsIds)
                        AND (p.type IN :roomType)
                        -- Lọc theo các tiêu chí khác
                        AND NOT (p.max_area < :minArea OR p.min_area > :maxArea)
                        AND NOT (p.max_rent < :minRent OR p.min_rent > :maxRent)
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
                        AND (a.wards_id IN :wardsIds)
                        AND (p.type IN :roomType)
                        AND NOT (p.max_area < :minArea OR p.min_area > :maxArea)
                        AND NOT (p.max_rent < :minRent OR p.min_rent > :maxRent)
                        AND (bh.electricity_price BETWEEN COALESCE(:minElectricityPrice, bh.electricity_price) 
                                                  AND COALESCE(:maxElectricityPrice, bh.electricity_price))
                        AND (bh.water_price BETWEEN COALESCE(:minWaterPrice, bh.water_price) 
                                              AND COALESCE(:maxWaterPrice, bh.water_price))
                        AND (bh.features LIKE '%' || COALESCE(:features, bh.features) || '%')
                        AND (bh.description LIKE '%' || COALESCE(:description, bh.description) || '%')
                    """
    )
    Page<PostProjection> findAllByAddressAndFeaturesWithQuery(
            @Param("wardsIds") List<Long> wardsId,
            @Param("minRent") Float minRent,
            @Param("maxRent") Float maxRent,
            @Param("minArea") Float minArea,
            @Param("maxArea") Float maxArea,
            @Param("minElectricityPrice") Float minElectricityPrice,
            @Param("maxElectricityPrice") Float maxElectricityPrice,
            @Param("minWaterPrice") Float minWaterPrice,
            @Param("maxWaterPrice") Float maxWaterPrice,
            @Param("features") String features,
            @Param("description") String description,
            @Param("roomType") List<Integer> roomType,
            Pageable pageable);

    @Query(nativeQuery = true, value = """
            
            SELECT
                p.id AS postId,
                p.user_id AS userId,
                p.address AS address,
                p.title AS title,
                CONCAT(u.first_name,' ',u.last_name) AS fullname,
                p.image_url         AS imageUrl,
                u.url_avatar AS urlAvatar,
                u.email AS email,
                u.phone AS phoneNumber,
                p.max_area AS maxArea,
                p.min_area AS minArea,
                p.max_rent AS maxRent,
                p.min_rent AS minRent,
                bh.id AS boardingHouseId,
                bh.name as boardingHouseName,
                bh.features AS features,
                bh.description AS description,
                p.water_price AS waterPrice,
                p.electricity_price AS electricityPrice,
                p.other_price AS otherPrice,
                p.date_updated as modifiedDate,
                p.type AS type
            
            FROM post p
            INNER JOIN user u ON p.user_id=u.id AND u.status=:status
            INNER JOIN boarding_house bh ON bh.id=p.boarding_house_id AND bh.status=:status
            WHERE p.id=:postId AND p.status=:status
            """)
    Optional<PostDetailProjection> findByPostIdAndStatusWithQuery(@Param("postId") Long postId, @Param("status") Integer status);

    List<Post> findAllByBoardingHouseIdAndStatus(Long boardingHouseId, Integer status);

    @Query(nativeQuery = true, value =
            "SELECT p.id, p.title, p.min_rent AS minRent, p.max_rent AS maxRent, " +
                    "p.min_area AS minArea, p.max_area AS maxArea, p.image_url AS imageUrl, " +
                    "p.address AS address, p.type AS type, p.date_updated AS modifiedDate " +
                    "FROM post p " +
                    "INNER JOIN boarding_house bh ON p.boarding_house_id = bh.id " +
                    "INNER JOIN address a ON bh.address_id = a.id " +
                    "INNER JOIN province pr ON a.province_id = pr.province_id " +
                    "INNER JOIN district d ON a.district_id = d.district_id " +
                    "INNER JOIN wards w ON a.wards_id = w.wards_id " +
                    "WHERE :wardName IS NOT NULL AND :wardName != '' " +
                    "AND LOWER(w.name) LIKE CONCAT('%', LOWER(:wardName), '%') " +
                    "AND LOWER(d.name) LIKE CONCAT('%', LOWER(:districtName), '%') " +
                    "AND LOWER(pr.name) LIKE CONCAT('%', LOWER(:provinceName), '%') " +
                    "AND bh.status = :status AND p.status = :status " +
                    "ORDER BY p.min_rent ASC, p.max_rent ASC, p.min_area ASC, p.max_area ASC, p.date_updated DESC " +
                    "LIMIT 10")
    List<PostProjection> findByWard(String provinceName, String districtName, String wardName, Integer status);

    @Query(nativeQuery = true, value =
            "SELECT p.id, p.title, p.min_rent AS minRent, p.max_rent AS maxRent, " +
                    "p.min_area AS minArea, p.max_area AS maxArea, p.image_url AS imageUrl, " +
                    "p.address AS address, p.type AS type, p.date_updated AS modifiedDate " +
                    "FROM post p " +
                    "INNER JOIN boarding_house bh ON p.boarding_house_id = bh.id " +
                    "INNER JOIN address a ON bh.address_id = a.id " +
                    "INNER JOIN province pr ON a.province_id = pr.province_id " +
                    "INNER JOIN district d ON a.district_id = d.district_id " +
                    "LEFT JOIN wards w ON a.wards_id = w.wards_id " +
                    "WHERE :districtName IS NOT NULL AND :districtName != '' " +
                    "AND LOWER(d.name) LIKE CONCAT('%', LOWER(:districtName), '%') " +
                    "AND LOWER(pr.name) LIKE CONCAT('%', LOWER(:provinceName), '%') " +
                    "AND (:wardName IS NULL OR :wardName = '' OR LOWER(w.name) NOT LIKE CONCAT('%', LOWER(:wardName), '%')) " +
                    "AND bh.status = :status AND p.status = :status " +
                    "ORDER BY p.min_rent ASC, p.max_rent ASC, p.min_area ASC, p.max_area ASC, p.date_updated DESC " +
                    "LIMIT :limit")
    List<PostProjection> findByDistrict(String provinceName, String districtName, String wardName, Integer status, Integer limit);

    @Query(nativeQuery = true, value =
            "SELECT p.id, p.title, p.min_rent AS minRent, p.max_rent AS maxRent, " +
                    "p.min_area AS minArea, p.max_area AS maxArea, p.image_url AS imageUrl, " +
                    "p.address AS address, p.type AS type, p.date_updated AS modifiedDate " +
                    "FROM post p " +
                    "INNER JOIN boarding_house bh ON p.boarding_house_id = bh.id " +
                    "INNER JOIN address a ON bh.address_id = a.id " +
                    "INNER JOIN province pr ON a.province_id = pr.province_id " +
                    "LEFT JOIN district d ON a.district_id = d.district_id " +
                    "LEFT JOIN wards w ON a.wards_id = w.wards_id " +
                    "WHERE :provinceName IS NOT NULL AND :provinceName != '' " +
                    "AND LOWER(pr.name) LIKE CONCAT('%', LOWER(:provinceName), '%') " +
                    "AND (:districtName IS NULL OR :districtName = '' OR LOWER(d.name) NOT LIKE CONCAT('%', LOWER(:districtName), '%')) " +
                    "AND (:wardName IS NULL OR :wardName = '' OR LOWER(w.name) NOT LIKE CONCAT('%', LOWER(:wardName), '%')) " +
                    "AND bh.status = :status AND p.status = :status " +
                    "ORDER BY p.min_rent ASC, p.max_rent ASC, p.min_area ASC, p.max_area ASC, p.date_updated DESC " +
                    "LIMIT :limit")
    List<PostProjection> findByProvince(String provinceName, String districtName, String wardName, Integer status, Integer limit);
}

