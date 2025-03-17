package com.example.good_lodging_service.dto.request.Post;

import com.example.good_lodging_service.dto.request.Image.ImageRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class PostRequest {
    String title;
    @JsonIgnore // Bỏ qua khi serialize
    MultipartFile imageUrl;
    Float area;
    Float roomRent;
    Long userId;
    Long boardingHouseId;
}
