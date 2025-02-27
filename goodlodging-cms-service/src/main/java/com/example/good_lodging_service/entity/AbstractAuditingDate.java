package com.example.good_lodging_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public abstract class AbstractAuditingDate extends AbstractAuditingDateCreated implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @LastModifiedDate
    @Column(name = "date_updated")
    @JsonIgnore
    private Instant dateUpdated;
}
