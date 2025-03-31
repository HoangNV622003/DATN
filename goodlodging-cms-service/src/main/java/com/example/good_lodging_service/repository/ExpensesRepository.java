package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.entity.Expenses;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public interface ExpensesRepository extends JpaRepository<Expenses, Long> {
    List<Expenses> findByEntityIdAndEntityTypeAndStatusOrderByDateUpdatedDesc(Long entityId, Integer entityType, Integer status);
}
