package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.EntityType;
import com.example.good_lodging_service.dto.request.BoardingHouse.BoardingHouseRequest;
import com.example.good_lodging_service.dto.request.BoardingHouse.BoardingHouseUpdateRequest;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseDetailResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Image.ImageResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import com.example.good_lodging_service.entity.Address;
import com.example.good_lodging_service.entity.BoardingHouse;
import com.example.good_lodging_service.entity.Image;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.AddressMapper;
import com.example.good_lodging_service.mapper.BoardingHouseMapper;
import com.example.good_lodging_service.mapper.ImageMapper;
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
    ImageRepository imageRepository;
    ImageMapper imageMapper;
    RoomMapper roomMapper;
    RoomRepository roomRepository;

    public BoardingHouseDetailResponse createBoardingHouse(BoardingHouseRequest request) {
        if (boardingHouseRepository.existsByNameAndUserIdAndStatus(request.getName(), request.getUserId(), CommonStatus.ACTIVE.getValue())) {
            throw new AppException(ApiResponseCode.BOARDING_HOUSE_ALREADY_EXISTED);
        }

        //save address
        Address address = addressMapper.toAddress(request.getAddress());
        address.setStatus(CommonStatus.ACTIVE.getValue());
        address = addressRepository.save(address);

        //save image

        //save boarding house
        BoardingHouse boardingHouse = boardingHouseMapper.toBoardingHouse(request);
        boardingHouse.setStatus(CommonStatus.ACTIVE.getValue());
        boardingHouse.setAddressId(address.getId());
        boardingHouse = boardingHouseRepository.save(boardingHouse);
        return boardingHouseMapper.toBoardingHouseDetailResponseDTO(boardingHouse);
    }


    public BoardingHouseDetailResponse getDetailBoardingHouse(Long boardingHouseId) {
        BoardingHouse boardingHouse = findById(boardingHouseId);

        //get rooms
        List<RoomResponse> rooms = roomRepository.findAllByBoardingHouseIdAndStatus(boardingHouseId, CommonStatus.ACTIVE.getValue())
                .stream().map(roomMapper::toRoomResponseDTO).toList();
        BoardingHouseDetailResponse response = boardingHouseMapper.toBoardingHouseDetailResponseDTO(boardingHouse);
        response.setRooms(ValueUtils.getOrDefault(rooms, new ArrayList<>()));

        //get images
        List<ImageResponse> images = imageRepository.findAllByEntityIdInAndEntityTypeAndStatus(List.of(boardingHouseId), EntityType.BOARDING_HOUSE.getValue(), CommonStatus.ACTIVE.getValue())
                .stream().map(imageMapper::toImageResponse).toList();
        response.setImages(ValueUtils.getOrDefault(images, new ArrayList<>()));

        //get Address
        Address address = addressRepository.findByIdAndStatus(boardingHouse.getAddressId(), CommonStatus.ACTIVE.getValue()).orElse(null);
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
        //delete boarding house
        List<BoardingHouse> boardingHouses = boardingHouseRepository.findAllByIdInAndStatus(boardingHouseIds, CommonStatus.ACTIVE.getValue());
        boardingHouses.forEach(boardingHouse -> boardingHouse.setStatus(CommonStatus.DELETED.getValue()));

        //delete address
        List<Long> addressIds = boardingHouses.stream().map(BoardingHouse::getAddressId).toList();
        List<Address> addressPresentations = addressRepository.findAllById(addressIds);
        addressPresentations.forEach(addressPresentation -> addressPresentation.setStatus(CommonStatus.DELETED.getValue()));
        boardingHouseRepository.saveAll(boardingHouses);
        addressRepository.saveAll(addressPresentations);
        return CommonResponse.builder().result(ApiResponseCode.BOARDING_HOUSE_DELETED_SUCCESSFUL.getMessage()).build();
    }

    public BoardingHouse findById(Long boardingHouseId) {
        return boardingHouseRepository.findByIdAndStatus(boardingHouseId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }

}
