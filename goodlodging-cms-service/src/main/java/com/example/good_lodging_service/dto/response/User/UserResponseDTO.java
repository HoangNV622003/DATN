package com.example.good_lodging_service.dto.response.User;

import com.example.good_lodging_service.dto.response.Role.RoleResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponseDTO {
    Long id;
    String username;
    String firstName;
    String lastName;
    String email;
    String phone;
    String gender;
    String imageUrl;
    LocalDate birthday;
    List<RoleResponse> roles;
    Integer status;
}
