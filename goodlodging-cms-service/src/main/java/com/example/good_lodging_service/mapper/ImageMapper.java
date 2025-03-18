package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.response.Image.ImageResponse;
import com.example.good_lodging_service.entity.Image;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    ImageResponse toImageResponse(Image image);
}
