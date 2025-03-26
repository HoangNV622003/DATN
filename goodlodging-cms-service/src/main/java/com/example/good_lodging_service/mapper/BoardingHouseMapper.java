package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.request.BoardingHouse.BoardingHouseRequest;
import com.example.good_lodging_service.dto.request.BoardingHouse.BoardingHouseUpdateRequest;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseDetailResponse;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.entity.BoardingHouse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BoardingHouseMapper {
    @Mapping(target = "status", ignore = true)
    BoardingHouse toBoardingHouse(BoardingHouseRequest requestDTO);

    @Mapping(target = "rooms", ignore = true)
    BoardingHouseDetailResponse toBoardingHouseDetailResponseDTO(BoardingHouse boardingHouse);

    @Mapping(target = "status", ignore = true)
    @Mapping(target = "addressId", ignore = true)
    void updateBoardingHouse(@MappingTarget BoardingHouse boardingHouse, BoardingHouseRequest boardingHouseUpdateRequest);

    @Mapping(target = "imageUrl", ignore = true)
    BoardingHouseResponse toBoardingHouseResponse(BoardingHouse boardingHouse);
}