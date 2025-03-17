package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.dto.request.Image.ImageIdentifier;
import com.example.good_lodging_service.entity.Image;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findAllByEntityIdAndEntityTypeAndStatus(Long entityId, Integer entityType, Integer status);
    Optional<Image> findByIdAndStatus(Long id, Integer status);
    List<Image> findAllByEntityIdInAndEntityTypeAndStatus(List<Long> entityId, Integer entityType, Integer status);
}
