package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.EntityType;
import com.example.good_lodging_service.dto.response.Image.ImageResponse;
import com.example.good_lodging_service.entity.Image;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.ImageMapper;
import com.example.good_lodging_service.repository.ImageRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UploadService {
    ImageRepository imageRepository;
    @Value("${upload.uploadDir}")
    @NonFinal
    String uploadDir;
    ImageMapper imageMapper;
    public Image uploadImage(Long entityId,Integer entityType, MultipartFile file) {
        try{
            if (!file.isEmpty()) {
                String originalFileName = file.getOriginalFilename();
                String sanitizedFileName = originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");
                String fileName = UUID.randomUUID() + "_" + sanitizedFileName;

                // Đường dẫn lưu file (có thể thay đổi)
                File uploadFile = new File(uploadDir + fileName);

                // Tạo thư mục nếu chưa tồn tại
                new File(uploadDir).mkdirs();


                // Lưu file vào thư mục
                file.transferTo(uploadFile);

                Image image = Image.builder()
                        .entityId(entityId)
                        .entityType(entityType)
                        .imageUrl("uploads/" + fileName)
                        .status(CommonStatus.ACTIVE.getValue())
                        .build();
                return imageRepository.save(image);

            }
        }catch (Exception e){
            throw new AppException(ApiResponseCode.BAD_REQUEST);
        }
        return null;
    }
    public List<ImageResponse> uploadImages(Long entityId, Integer entityType, MultipartFile[] files) {
        try {
            List<Image> images = new ArrayList<>();

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalFileName = file.getOriginalFilename();
                    String sanitizedFileName = originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");
                    String fileName = UUID.randomUUID() + "_" + sanitizedFileName;

                    // Đường dẫn lưu file (có thể thay đổi)
                    File uploadFile = new File(uploadDir + fileName);

                    // Tạo thư mục nếu chưa tồn tại
                    new File(uploadDir).mkdirs();


                    // Lưu file vào thư mục
                    file.transferTo(uploadFile);

                    images.add(Image.builder().entityId(entityId).entityType(entityType).imageUrl("uploads/" + file.getOriginalFilename()).build());
                }
            }
            return imageRepository.saveAll(images).stream().map(imageMapper::toImageResponse).toList();

        } catch (Exception e) {
            throw new AppException(ApiResponseCode.BAD_REQUEST);
        }
    }

    public List<ImageResponse> uploadBoardingHouseImages(Long boardingHouseId, MultipartFile[] files) {
        return uploadImages(boardingHouseId, EntityType.BOARDING_HOUSE.getValue(), files);
    }
    public void removeFiles(List<Image> images) {
        // Xóa file cũ
        for (Image image : images) {
            Path filePath = Paths.get(image.getImageUrl().replaceFirst("/", ""));
            if (Files.exists(filePath)) {
                try {
                    Files.delete(filePath);
                } catch (IOException e) {
                    log.error("REMOVE FILE ERROR: ", e);
                    throw new AppException(ApiResponseCode.BAD_REQUEST);
                }
            }
        }
        images.forEach(image -> image.setStatus(CommonStatus.DELETED.getValue()));
        imageRepository.saveAll(images);
    }
}
