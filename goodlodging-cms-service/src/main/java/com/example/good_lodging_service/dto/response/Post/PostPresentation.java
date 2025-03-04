package com.example.good_lodging_service.dto.response.Post;

import java.time.Instant;

public interface PostPresentation {
    String getUrlImage();
    String getAddress();
    String getDescription();
    Long getPrice();
    Long getArea();
    Instant getModifiedDate();
}
