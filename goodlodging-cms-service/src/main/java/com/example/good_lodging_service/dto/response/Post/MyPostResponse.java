package com.example.good_lodging_service.dto.response.Post;

import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.entity.Post;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MyPostResponse {
    PostResponse postResponse;
    List<BoardingHouseResponse> boardingHouses;
}
