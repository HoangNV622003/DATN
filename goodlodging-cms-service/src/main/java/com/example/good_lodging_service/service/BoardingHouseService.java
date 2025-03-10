package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.dto.request.BoardingHouse.BoardingHouseRequest;
import com.example.good_lodging_service.dto.request.BoardingHouse.BoardingHouseUpdateRequest;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseDetailResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import com.example.good_lodging_service.entity.Address;
import com.example.good_lodging_service.entity.BoardingHouse;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.AddressMapper;
import com.example.good_lodging_service.mapper.BoardingHouseMapper;
import com.example.good_lodging_service.mapper.RoomMapper;
import com.example.good_lodging_service.repository.*;
import com.example.good_lodging_service.utils.ValueUtils;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BoardingHouseService {
    BoardingHouseRepository boardingHouseRepository;
    BoardingHouseMapper boardingHouseMapper;
    AddressRepository addressRepository;
    AddressMapper addressMapper;
    RoomMapper roomMapper;
    RoomRepository roomRepository;

    public BoardingHouseDetailResponse createBoardingHouse(BoardingHouseRequest request) {
        if (boardingHouseRepository.existsByNameAndUserIdAndStatus(request.getName(), request.getUserId(), CommonStatus.ACTIVE.getValue())) {
            throw new AppException(ApiResponseCode.BOARDING_HOUSE_ALREADY_EXISTED);
        }

        BoardingHouse boardingHouse = boardingHouseMapper.toBoardingHouse(request);
        boardingHouse.setStatus(CommonStatus.ACTIVE.getValue());
        boardingHouse = boardingHouseRepository.save(boardingHouse);

        return boardingHouseMapper.toBoardingHouseDetailResponseDTO(boardingHouse);
    }


    public BoardingHouseDetailResponse getDetailBoardingHouse(Long boardingHouseId) {
        BoardingHouse boardingHouse = findById(boardingHouseId);

        List<RoomResponse> rooms = roomRepository.findAllByBoardingHouseIdAndStatus(boardingHouseId, CommonStatus.ACTIVE.getValue())
                .stream().map(roomMapper::toRoomResponseDTO).toList();
        BoardingHouseDetailResponse response = boardingHouseMapper.toBoardingHouseDetailResponseDTO(boardingHouse);
        response.setRooms(ValueUtils.getOrDefault(rooms, new ArrayList<>()));

        Address address = addressRepository.findByBoardingHouseIdAndStatusWithQuery(boardingHouseId, CommonStatus.ACTIVE.getValue());
        response.setAddress(!Objects.isNull(address) ? address.getFullAddress() : "");
        return response;
    }

    public BoardingHouseDetailResponse updateBoardingHouse(Long id, BoardingHouseUpdateRequest request) {
        BoardingHouse boardingHouse = findById(id);
        if (boardingHouseRepository.existsByNameAndUserIdAndStatusAndIdNot(request.getName(), request.getUserId(), CommonStatus.ACTIVE.getValue(), id)) {
            throw new AppException(ApiResponseCode.BOARDING_HOUSE_ALREADY_EXISTED);
        }
        boardingHouseMapper.updateBoardingHouse(boardingHouse, request);
        boardingHouse.setStatus(CommonStatus.ACTIVE.getValue());
        boardingHouse = boardingHouseRepository.save(boardingHouse);
        return boardingHouseMapper.toBoardingHouseDetailResponseDTO(boardingHouse);
    }


    public CommonResponse deleteBoardingHouse(List<Long> boardingHouseIds) {
        List<BoardingHouse> boardingHouses = boardingHouseRepository.findAllByIdInAndStatus(boardingHouseIds, CommonStatus.ACTIVE.getValue());
        boardingHouses.forEach(boardingHouse -> boardingHouse.setStatus(CommonStatus.DELETED.getValue()));
        List<Address> addressPresentations = addressRepository.findAllByBoardingHouseIdInWithQuery(boardingHouseIds).stream().map(addressPresentation ->
                        Address.builder()
                                .id(addressPresentation.getAddressId())
                                .provinceId(addressPresentation.getProvinceId())
                                .districtId(addressPresentation.getDistrictId())
                                .wardsId(addressPresentation.getWardsId())
                                .streetName(addressPresentation.getStreetName())
                                .houseNumber(addressPresentation.getHouseNumber())
                                .fullAddress(addressPresentation.getFullAddress())
                                .status(CommonStatus.DELETED.getValue())
                                .build())
                .toList();

        boardingHouseRepository.saveAll(boardingHouses);
        addressRepository.saveAll(addressPresentations);
        return CommonResponse.builder().result(ApiResponseCode.BOARDING_HOUSE_DELETED_SUCCESSFUL.getMessage()).build();
    }

    public BoardingHouse findById(Long boardingHouseId) {
        return boardingHouseRepository.findByIdAndStatus(boardingHouseId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }

}
