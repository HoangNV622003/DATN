package com.example.good_lodging_service.repository;

import com.example.good_lodging_service.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface RoleRepository extends JpaRepository<Role,String> {
}
