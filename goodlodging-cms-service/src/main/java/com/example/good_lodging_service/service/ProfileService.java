package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.dto.response.Address.AddressResponse;
import com.example.good_lodging_service.dto.response.Address.AddressProjection;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseDetailResponse;
import com.example.good_lodging_service.dto.response.Profile.ProfileDetailResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import com.example.good_lodging_service.entity.RoomUser;
import com.example.good_lodging_service.entity.User;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.BoardingHouseMapper;
import com.example.good_lodging_service.mapper.RoomMapper;
import com.example.good_lodging_service.mapper.UserMapper;
import com.example.good_lodging_service.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileService {
    AddressRepository addressRepository;
    RoomUserRepository roomUserRepository;
    UserRepository userRepository;
    UserMapper userMapper;
    RoomRepository roomRepository;
    RoomMapper roomMapper;
    BoardingHouseRepository boardingHouseRepository;
    BoardingHouseMapper boardingHouseMapper;

    private List<BoardingHouseDetailResponse> setAddress(List<BoardingHouseDetailResponse> boardingHouseDetailResponses) {
        Map<Long, AddressResponse> addressResponseMap = new HashMap<>();
        List<Long> boardingHouseIds = boardingHouseDetailResponses.stream().map(BoardingHouseDetailResponse::getId).toList();
        List<AddressProjection> addressProjections = addressRepository.findAllByBoardingHouseIdInWithQuery(boardingHouseIds);
        addressProjections.forEach(addressProjection -> {
            addressResponseMap.put(addressProjection.getAddressId(), AddressResponse.builder()
                    .id(addressProjection.getAddressId())
                    .fullAddress(addressProjection.getFullAddress())
                    .build());
        });
        boardingHouseDetailResponses.forEach(boardingHouseResponse -> {
            boardingHouseResponse.setAddress(addressResponseMap.get(boardingHouseResponse.getId()).getFullAddress());
        });
        return boardingHouseDetailResponses;
    }

    public ProfileDetailResponse getProfile(Long id) {
        return ProfileDetailResponse.builder()
                .user(userMapper.toUserResponse(findById(id)))
                .boardingHouses(getAllBoardingHouseByUserId(id))
                .rooms(getAllRoomByUserId(id))
                .build();

    }

    private List<BoardingHouseDetailResponse> getAllBoardingHouseByUserId(Long userId) {
        List<BoardingHouseDetailResponse> boardingHouses = boardingHouseRepository.findAllByUserIdAndStatus(userId, CommonStatus.ACTIVE.getValue())
                .stream().map(boardingHouseMapper::toBoardingHouseDetailResponseDTO).toList();
        List<Long> boardingHouseIds = boardingHouses.stream().map(BoardingHouseDetailResponse::getId).toList();
        List<RoomResponse> rooms = roomRepository.findAllByBoardingHouseIdInAndStatus(boardingHouseIds, CommonStatus.ACTIVE.getValue())
                .stream().map(roomMapper::toRoomResponseDTO).toList();

        Map<Long, RoomResponse> roomResponseMap = new HashMap<>();
        rooms.forEach(roomResponse -> roomResponseMap.put(roomResponse.getId(), roomResponse));

        boardingHouses.forEach(boardingHouse -> {
            boardingHouse.setRooms(List.of(roomResponseMap.get(boardingHouse.getId())));
        });


        return setAddress(boardingHouses);
    }

    private List<RoomResponse> getAllRoomByUserId(Long userId) {
        List<RoomUser> roomUsers = roomUserRepository.findAllByUserIdAndStatus(userId, CommonStatus.ACTIVE.getValue());
        List<Long> roomIds = roomUsers.stream().map(RoomUser::getRoomId).toList();
        return roomRepository.findAllById(roomIds).stream().map(roomMapper::toRoomResponseDTO).toList();
    }

    private User findById(Long id) {
        return userRepository.findByIdAndStatus(id, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }
}
