package com.example.good_lodging_service.dto.request.User;

import com.example.good_lodging_service.dto.request.Address.AddressRequest;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateRequest {
    String username;
    String password;
    String firstName;
    String lastName;
    String email;
    String phone;
    AddressRequest address;
    String gender;
    LocalDate birthday;
}
