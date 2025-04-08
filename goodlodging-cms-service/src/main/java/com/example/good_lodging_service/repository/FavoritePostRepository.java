package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.dto.response.Post.PostProjection;
import com.example.good_lodging_service.entity.FavoritePost;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface FavoritePostRepository extends JpaRepository<FavoritePost, Long> {
    @Query(nativeQuery = true, value = """
                SELECT DISTINCT 
                p.id                AS id,
                p.title             AS title,
                p.max_area          AS maxArea,
                p.min_area          AS minArea,
                p.max_rent          AS maxRent,
                p.min_rent          AS minRent,
                p.user_id           AS userId,
                p.image_url         AS imageUrl,
                p.address           AS address,
                p.boarding_house_id AS boardingHouseId,
                p.date_updated      AS modifiedDate,
                p.type              AS type,
                p.room_id           AS roomId
            FROM post p INNER JOIN favorite_post fp ON fp.post_id=p.id 
            WHERE  p.status=:status AND fp.status=:status AND fp.user_id=:userId
            """)
    List<PostProjection> findByUserIdWithQuery(Long userId, Integer status);

    Optional<FavoritePost> findByIdAndStatus(Long id, Integer status);

    boolean existsFavoritePostByPostIdAndUserIdAndStatus(Long postId, Long userId, Integer status);

    List<FavoritePost> findAllByPostIdInAndUserIdAndStatus(List<Long> ids, Long userId, Integer status);
}
