package com.example.good_lodging_service.dto.response.Profile;

import com.example.good_lodging_service.dto.response.Post.PostDetailProjection;
import com.example.good_lodging_service.utils.ValueUtils;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Profile;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileResponse {
    Long userId;
    String fullName;
    String imageUrl;
    String email;
    String phoneNumber;

    public static ProfileResponse fromPostDetailProjection(PostDetailProjection postDetailProjection,String imageUrl) {
        return ProfileResponse.builder()
                .userId(postDetailProjection.getUserId())
                .fullName(ValueUtils.getOrDefault(postDetailProjection.getFullName(), ""))
                .imageUrl(imageUrl)
                .email(ValueUtils.getOrDefault(postDetailProjection.getEmail(),""))
                .phoneNumber(ValueUtils.getOrDefault(postDetailProjection.getPhoneNumber(),""))
                .build();
    }
}
