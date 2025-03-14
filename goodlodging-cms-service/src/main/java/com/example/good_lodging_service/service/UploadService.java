package com.example.good_lodging_service.service;

import com.example.good_lodging_service.dto.response.Image.ImageResponse;
import com.example.good_lodging_service.entity.Image;
import com.example.good_lodging_service.repository.ImageRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UploadService {
    ImageRepository imageRepository;

    public ImageResponse uploadImage(MultipartFile file) throws IOException {
        return null;
    }
}
