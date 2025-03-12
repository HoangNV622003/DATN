package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.dto.request.Image.ImageIdentifier;
import com.example.good_lodging_service.entity.Image;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findAllByEntityIdAndEntityTypeAndStatus(Long entityId, Integer entityType, Integer status);
}
