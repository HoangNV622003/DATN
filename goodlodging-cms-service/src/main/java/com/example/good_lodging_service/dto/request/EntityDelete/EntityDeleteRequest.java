package com.example.good_lodging_service.dto.request.EntityDelete;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EntityDeleteRequest {
    List<Long>ids;
}
