package com.example.good_lodging_service.dto.response.AuthorInfo;

import com.example.good_lodging_service.dto.response.Post.PostProjection;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthorInfo {
    UserResponseDTO authorInfo;
    Page<PostProjection> posts;
}
