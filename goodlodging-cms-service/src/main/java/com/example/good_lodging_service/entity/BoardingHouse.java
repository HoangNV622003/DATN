package com.example.good_lodging_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serial;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BoardingHouse extends AbstractAuditingEntity implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long userId;
    String name;
    String description;
    Float maxRent;
    Float minRent;
    Float roomArea;
    Float maxArea;
    Float minArea;
    Float electricityPrice;
    Float waterPrice;
    Float otherPrice;
    String features;
    Long addressId;
    Integer status;
}
