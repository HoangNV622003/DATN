package com.example.good_lodging_service.dto.response.Member;

import com.example.good_lodging_service.entity.Image;
import com.example.good_lodging_service.utils.ValueUtils;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.lang.reflect.Member;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MemberResponse {
    Long id;
    String username;
    String fullName;
    String email;
    String phone;
    String gender;
    String imageUrl;
    Instant updatedAt;
    LocalDate birthday;

    public static MemberResponse fromMemberProjection(MemberProjection memberProjection) {
        return MemberResponse.builder()
                .id(memberProjection.getId())
                .username(memberProjection.getUsername())
                .fullName(memberProjection.getFullName())
                .email(memberProjection.getEmail())
                .phone(memberProjection.getPhoneNumber())
                .gender(memberProjection.getGender())
                .birthday(memberProjection.getDateOfBirth())
                .updatedAt(memberProjection.getUpdatedAt())
                .imageUrl(ValueUtils.getOrDefault(memberProjection.getImageUrl(), ""))
                .build();
    }
}
