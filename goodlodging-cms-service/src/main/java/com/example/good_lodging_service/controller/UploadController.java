package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.response.Image.ImageResponse;
import com.example.good_lodging_service.service.UploadService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController("/uploads")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UploadController {
    UploadService uploadService;
    @PostMapping("/boarding-house/{id}")
    public ResponseEntity<List<ImageResponse>> updateBoardingHouseImages(@PathVariable Long id, @RequestParam("files") MultipartFile[] files) {
        return ResponseEntity.ok(uploadService.uploadBoardingHouseImages(id,files));
    }
}
