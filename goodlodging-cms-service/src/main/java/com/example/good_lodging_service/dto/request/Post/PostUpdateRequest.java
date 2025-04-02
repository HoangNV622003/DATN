package com.example.good_lodging_service.dto.request.Post;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostUpdateRequest {
    String title;
    MultipartFile imageUrl;
    Float maxArea;
    Float minArea;
    Float maxRent;
    Float minRent;
    Float electricityPrice;
    Float waterPrice;
    Float otherPrice;
    String address;
}