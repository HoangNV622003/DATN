package com.example.good_lodging_service.dto.request.BoardingHouse;

import com.example.good_lodging_service.dto.request.Address.AddressRequest;
import com.example.good_lodging_service.dto.request.Image.ImageFileRequest;
import com.example.good_lodging_service.dto.request.Image.ImageRequest;
import com.example.good_lodging_service.dto.request.Room.RoomRequest;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BoardingHouseRequest {
    Long userId;
    String name;
    String description;
    Float electricityPrice;
    Float waterPrice;
    Float roomRent;
    Float roomArea;
    String features;
    List<ImageRequest> imageUrls;
    List<ImageFileRequest> imageFiles;
    AddressRequest address;
}
