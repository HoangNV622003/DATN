package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.request.BoardingHouse.BoardingHouseRequest;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.entity.BoardingHouse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BoardingHouseMapper {
    BoardingHouse toBoardingHouse(BoardingHouseRequest requestDTO);
    BoardingHouseResponse toBoardingHouseResponseDTO(BoardingHouse boardingHouse);
}
