package com.example.good_lodging_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;

public abstract class AbstractAuditingEntityCreated implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @CreatedDate
    @Column(name = "date_created",updatable = false)
    @JsonIgnore
    private Instant dateCreated;

    @LastModifiedDate
    @Column(name = "date_updated")
    @JsonIgnore
    private Instant dateUpdated;

    @CreatedBy
    @Column(name = "created_by", nullable = false, updatable = false)
    @JsonIgnore
    private Long createdBy;
}
