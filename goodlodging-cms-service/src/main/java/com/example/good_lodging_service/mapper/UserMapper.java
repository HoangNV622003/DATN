package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.request.User.UserCreateRequest;
import com.example.good_lodging_service.dto.request.User.UserUpdateRequest;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreateRequest requestDTO);

    @Mapping(target = "roles", ignore = true)
    UserResponseDTO toUserResponse(User user);

    void updateUser(@MappingTarget User user, UserUpdateRequest userUpdateRequest);
}
