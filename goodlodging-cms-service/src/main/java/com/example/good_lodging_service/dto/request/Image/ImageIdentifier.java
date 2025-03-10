package com.example.good_lodging_service.dto.request.Image;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ImageIdentifier {
    Long entityId;
    Integer entityType;
}
