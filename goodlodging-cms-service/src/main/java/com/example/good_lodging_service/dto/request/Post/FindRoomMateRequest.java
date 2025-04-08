package com.example.good_lodging_service.dto.request.Post;

import com.example.good_lodging_service.dto.request.Image.ImageFileRequest;
import com.example.good_lodging_service.dto.request.Image.ImageRequest;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FindRoomMateRequest {
    @NotNull(message = "boardingHouseId không được để trống")
    Long boardingHouseId;
    @NotNull(message = "roomId không được để trống")
    Long roomId;
    @NotNull(message = "userId không được để trống")
    Long userId;
    @NotNull(message = "title không được để trống")
    String title;
    @NotNull(message="vui lòng chọn 1 hình ảnh")
    MultipartFile imageFile;
}
