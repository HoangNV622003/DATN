package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.EntityType;
import com.example.good_lodging_service.dto.request.BoardingHouse.BoardingHouseRequest;
import com.example.good_lodging_service.dto.request.BoardingHouse.BoardingHouseUpdateRequest;
import com.example.good_lodging_service.dto.request.Image.ImageFileRequest;
import com.example.good_lodging_service.dto.request.Image.ImageRequest;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseDetailResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Image.ImageResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import com.example.good_lodging_service.entity.Address;
import com.example.good_lodging_service.entity.BoardingHouse;
import com.example.good_lodging_service.entity.Image;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.AddressMapper;
import com.example.good_lodging_service.mapper.BoardingHouseMapper;
import com.example.good_lodging_service.mapper.ImageMapper;
import com.example.good_lodging_service.mapper.RoomMapper;
import com.example.good_lodging_service.repository.*;
import com.example.good_lodging_service.utils.ValueUtils;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BoardingHouseService {
    BoardingHouseRepository boardingHouseRepository;
    BoardingHouseMapper boardingHouseMapper;
    AddressRepository addressRepository;
    AddressMapper addressMapper;
    ImageRepository imageRepository;
    ImageMapper imageMapper;
    RoomMapper roomMapper;
    RoomRepository roomRepository;
    @Value("${upload.uploadDir}")
    @NonFinal
    String uploadDir;

    public BoardingHouseDetailResponse createBoardingHouse(BoardingHouseRequest request) {
        if (boardingHouseRepository.existsByNameAndUserIdAndStatus(request.getName(), request.getUserId(), CommonStatus.ACTIVE.getValue())) {
            throw new AppException(ApiResponseCode.BOARDING_HOUSE_ALREADY_EXISTED);
        }

        //save address
        Address address = addressMapper.toAddress(request.getAddress());
        address.setStatus(CommonStatus.ACTIVE.getValue());
        address = addressRepository.save(address);

        //save boarding house
        BoardingHouse boardingHouse = boardingHouseMapper.toBoardingHouse(request);
        boardingHouse.setStatus(CommonStatus.ACTIVE.getValue());
        boardingHouse.setAddressId(address.getId());
        boardingHouse = boardingHouseRepository.save(boardingHouse);

        //save image
        imageRepository.saveAll(uploadFiles(boardingHouse.getId(), EntityType.BOARDING_HOUSE.getValue(), request.getImageFiles()));
        BoardingHouseDetailResponse boardingHouseDetailResponse = boardingHouseMapper.toBoardingHouseDetailResponseDTO(boardingHouse);
        boardingHouseDetailResponse.setRooms(new ArrayList<>());
        //get image
        List<ImageResponse> images = imageRepository.findAllByEntityIdAndEntityTypeAndStatus(boardingHouse.getId(), EntityType.BOARDING_HOUSE.getValue(), CommonStatus.ACTIVE.getValue())
                .stream().map(imageMapper::toImageResponse).toList();
        boardingHouseDetailResponse.setImages(ValueUtils.getOrDefault(images, new ArrayList<>()));
        return boardingHouseDetailResponse;
    }


    public BoardingHouseDetailResponse getDetailBoardingHouse(Long boardingHouseId) {
        BoardingHouse boardingHouse = findById(boardingHouseId);

        //get rooms
        List<RoomResponse> rooms = roomRepository.findAllByBoardingHouseIdAndStatus(boardingHouseId, CommonStatus.ACTIVE.getValue())
                .stream().map(roomMapper::toRoomResponseDTO).toList();
        BoardingHouseDetailResponse response = boardingHouseMapper.toBoardingHouseDetailResponseDTO(boardingHouse);
        response.setRooms(ValueUtils.getOrDefault(rooms, new ArrayList<>()));

        //get images
        List<ImageResponse> images = imageRepository.findAllByEntityIdInAndEntityTypeAndStatus(List.of(boardingHouseId), EntityType.BOARDING_HOUSE.getValue(), CommonStatus.ACTIVE.getValue())
                .stream().map(imageMapper::toImageResponse).toList();
        response.setImages(ValueUtils.getOrDefault(images, new ArrayList<>()));

        //get Address
        Address address = addressRepository.findByIdAndStatus(boardingHouse.getAddressId(), CommonStatus.ACTIVE.getValue()).orElse(null);
        response.setAddress(!Objects.isNull(address) ? addressMapper.toAddressResponseDTO(address) : null);
        return response;
    }

    public BoardingHouseDetailResponse updateBoardingHouse(Long id, BoardingHouseRequest request) {
        BoardingHouse boardingHouse = findById(id);
        if (boardingHouseRepository.existsByNameAndUserIdAndStatusAndIdNot(request.getName(), request.getUserId(), CommonStatus.ACTIVE.getValue(), id)) {
            throw new AppException(ApiResponseCode.BOARDING_HOUSE_ALREADY_EXISTED);
        }
        //update address
        Address address = addressRepository.findByIdAndStatus(boardingHouse.getAddressId(), CommonStatus.ACTIVE.getValue()).orElse(null);
        addressMapper.updateAddress(address, request.getAddress());
        address = addressRepository.save(address != null ? address : addressMapper.toAddress(request.getAddress()));
        boardingHouse.setAddressId(address.getId());
        //update boarding house
        boardingHouseMapper.updateBoardingHouse(boardingHouse, request);
        boardingHouse.setStatus(CommonStatus.ACTIVE.getValue());

        //update image
        updateImage(id, request.getImageFiles(), request.getImageUrls());

        //save boarding house
        boardingHouse = boardingHouseRepository.save(boardingHouse);


        return convertToDtoAndReturn(boardingHouse);
    }

    BoardingHouseDetailResponse convertToDtoAndReturn(BoardingHouse boardingHouse) {
        //get rooms
        List<RoomResponse> rooms = roomRepository.findAllByBoardingHouseIdAndStatus(boardingHouse.getId(), CommonStatus.ACTIVE.getValue())
                .stream().map(roomMapper::toRoomResponseDTO).toList();
        BoardingHouseDetailResponse response = boardingHouseMapper.toBoardingHouseDetailResponseDTO(boardingHouse);
        response.setRooms(ValueUtils.getOrDefault(rooms, new ArrayList<>()));

        //get images
        List<ImageResponse> images = imageRepository.findAllByEntityIdInAndEntityTypeAndStatus(List.of(boardingHouse.getId()), EntityType.BOARDING_HOUSE.getValue(), CommonStatus.ACTIVE.getValue())
                .stream().map(imageMapper::toImageResponse).toList();
        response.setImages(ValueUtils.getOrDefault(images, new ArrayList<>()));

        BoardingHouseDetailResponse boardingHouseDetailResponse = boardingHouseMapper.toBoardingHouseDetailResponseDTO(boardingHouse);
        boardingHouseDetailResponse.setRooms(ValueUtils.getOrDefault(rooms, new ArrayList<>()));
        boardingHouseDetailResponse.setImages(ValueUtils.getOrDefault(images, new ArrayList<>()));
        return boardingHouseDetailResponse;
    }

    void updateImage(Long boardingHouseId, List<ImageFileRequest> imageFiles, List<ImageRequest> imageUrls) {
        List<ImageFileRequest> safeImageFiles = imageFiles != null ? imageFiles : Collections.emptyList();
        List<ImageRequest> safeImageUrls = imageUrls != null ? imageUrls : Collections.emptyList();

        //update image status
        List<Image> existedImages = imageRepository.findAllByEntityIdAndEntityTypeAndStatus(boardingHouseId, EntityType.BOARDING_HOUSE.getValue(), CommonStatus.ACTIVE.getValue());
        existedImages.forEach(existedImage -> {
            existedImage.setStatus(CommonStatus.DELETED.getValue());
            safeImageUrls.forEach(imageUrl -> {
                if (existedImage.getImageUrl().equals(imageUrl.getImageUrl())) {
                    existedImage.setStatus(CommonStatus.ACTIVE.getValue());
                }
            });
        });

        //remove image
        removeFile(existedImages.stream().filter(image -> image.getStatus() == CommonStatus.DELETED.getValue()).toList());
        existedImages.addAll(uploadFiles(boardingHouseId, EntityType.BOARDING_HOUSE.getValue(), safeImageFiles));
        imageRepository.saveAll(existedImages);
    }

    void removeFile(List<Image> imageFiles) {
        // Xóa file cũ
        for (Image imageFile : imageFiles) {
            Path filePath = Paths.get(imageFile.getImageUrl().replaceFirst("/", ""));
            if (Files.exists(filePath)) {
                try {
                    Files.delete(filePath);
                } catch (IOException e) {
                    log.error("REMOVE FILE ERROR: ", e);
                    throw new AppException(ApiResponseCode.BAD_REQUEST);
                }
            }
        }
    }

    private List<Image> uploadFiles(Long entityId, Integer entityType, List<ImageFileRequest> files) {
        if (files == null || files.isEmpty()) {
            return Collections.emptyList();
        }
        try {
            List<Image> images = new ArrayList<>();

            for (ImageFileRequest file : files) {
                if (!file.getImageFile().isEmpty()) {
                    // Tạo tên file duy nhất
                    String originalFileName = file.getImageFile().getOriginalFilename();
                    String sanitizedFileName = originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");
                    String fileName = UUID.randomUUID() + "_" + sanitizedFileName;

                    // Đường dẫn lưu file (có thể thay đổi)
                    File uploadFile = new File(uploadDir + fileName);

                    // Tạo thư mục nếu chưa tồn tại
                    new File(uploadDir).mkdirs();


                    // Lưu file vào thư mục
                    file.getImageFile().transferTo(uploadFile);

                    images.add(Image.builder()
                            .entityId(entityId)
                            .entityType(entityType)
                            .imageUrl("uploads/" + fileName)
                            .status(CommonStatus.ACTIVE.getValue())
                            .build());
                }
            }
            return images;

        } catch (Exception e) {
            log.error("UPLOAD FILE ERROR: ", e);
            throw new AppException(ApiResponseCode.BAD_REQUEST);
        }

    }

    public CommonResponse deleteBoardingHouse(List<Long> boardingHouseIds) {
        //delete boarding house
        List<BoardingHouse> boardingHouses = boardingHouseRepository.findAllByIdInAndStatus(boardingHouseIds, CommonStatus.ACTIVE.getValue());
        boardingHouses.forEach(boardingHouse -> boardingHouse.setStatus(CommonStatus.DELETED.getValue()));

        //delete address
        List<Long> addressIds = boardingHouses.stream().map(BoardingHouse::getAddressId).toList();
        List<Address> addressPresentations = addressRepository.findAllById(addressIds);
        addressPresentations.forEach(addressPresentation -> addressPresentation.setStatus(CommonStatus.DELETED.getValue()));
        boardingHouseRepository.saveAll(boardingHouses);
        addressRepository.saveAll(addressPresentations);
        return CommonResponse.builder().result(ApiResponseCode.BOARDING_HOUSE_DELETED_SUCCESSFUL.getMessage()).build();
    }

    public BoardingHouse findById(Long boardingHouseId) {
        return boardingHouseRepository.findByIdAndStatus(boardingHouseId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }

}
