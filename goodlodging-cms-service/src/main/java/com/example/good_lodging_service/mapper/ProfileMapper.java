package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.response.Profile.ProfileResponse;
import com.example.good_lodging_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    @Mapping(target = "userId",source = "id")
    @Mapping(target = "fullName",ignore = true)
    @Mapping(target = "imageUrl",source = "urlAvatar")
    @Mapping(target = "phoneNumber",source = "phone")
    ProfileResponse profileToProfileResponse(User user);
}