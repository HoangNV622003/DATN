package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.EntityType;
import com.example.good_lodging_service.dto.request.EntityDelete.EntityDeleteRequest;
import com.example.good_lodging_service.dto.request.Room.RoomRequest;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Expenses.ExpensesResponse;
import com.example.good_lodging_service.dto.response.Room.MyRoomResponse;
import com.example.good_lodging_service.dto.response.Room.RoomDetailResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import com.example.good_lodging_service.dto.response.RoomUser.RoomUserProjection;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.entity.Room;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.BoardingHouseMapper;
import com.example.good_lodging_service.mapper.ExpensesMapper;
import com.example.good_lodging_service.mapper.RoomMapper;
import com.example.good_lodging_service.mapper.UserMapper;
import com.example.good_lodging_service.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomService {
    RoomRepository roomRepository;
    RoomUserRepository roomUserRepository;
    RoomMapper roomMapper;
    UserMapper userMapper;
    ExpensesMapper expensesMapper;
    UserRepository userRepository;
    ExpensesRepository expensesRepository;
    private final BoardingHouseRepository boardingHouseRepository;
    private final BoardingHouseMapper boardingHouseMapper;

    public RoomResponse createRoom(RoomRequest request) {
        if (roomRepository.existsByNameAndBoardingHouseIdAndStatus(request.getName(), request.getBoardingHouseId(), CommonStatus.ACTIVE.getValue()))
            throw new AppException(ApiResponseCode.ROOM_ALREADY_EXITED);
        Room room = roomMapper.toRoom(request);
        room.setStatus(CommonStatus.ACTIVE.getValue());
        return roomMapper.toRoomResponseDTO(roomRepository.save(room));
    }

    public RoomDetailResponse getRoomDetail(Long roomId) {
        RoomResponse roomResponse = roomMapper.toRoomResponseDTO(findById(roomId));
        List<UserResponseDTO> users = roomUserRepository.findAllByRoomIdAndStatusWithQuery(roomId, CommonStatus.ACTIVE.getValue())
                .stream().map(userMapper::toUserResponse).toList();
        return RoomDetailResponse.builder().room(roomResponse).users(users).build();
    }

    private Room findById(Long roomId) {
        return roomRepository.findByIdAndStatus(roomId, CommonStatus.ACTIVE.getValue()).orElseThrow(() -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }

    public RoomResponse updateRoom(Long roomId, RoomRequest request) {
        Room room = findById(roomId);
        if (roomRepository.existsByNameAndBoardingHouseIdAndStatusAndIdNot(request.getName(), request.getBoardingHouseId(), CommonStatus.ACTIVE.getValue(), room.getId()))
            throw new AppException(ApiResponseCode.ROOM_ALREADY_EXITED);
        room = roomMapper.toRoom(request);
        room.setId(roomId);
        room.setStatus(CommonStatus.ACTIVE.getValue());
        return roomMapper.toRoomResponseDTO(roomRepository.save(room));
    }

    public CommonResponse deleteRoom(EntityDeleteRequest request) {
        List<Room> rooms = roomRepository.findAllById(request.getIds());
        rooms.forEach(room -> {
            room.setStatus(CommonStatus.DELETED.getValue());
        });
        roomRepository.saveAll(rooms);
        return CommonResponse.builder().result(ApiResponseCode.ROOM_DELETED_SUCCESSFUL.getMessage()).build();
    }

    public MyRoomResponse getMyRoom(Long userId) {
        RoomUserProjection roomUserProjection = roomUserRepository.findByUserIdAndStatusWithQuery(userId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        UserResponseDTO user=UserResponseDTO.builder()
                .id(roomUserProjection.getUserId())
                .firstName(roomUserProjection.getFirstName())
                .lastName(roomUserProjection.getLastName())
                .phone(roomUserProjection.getPhoneNumber())
                .email(roomUserProjection.getEmail())
                .build();
        //get room
        RoomDetailResponse roomDetail = getRoomDetail(roomUserProjection.getRoomId());
        BoardingHouseResponse boardingHouse = BoardingHouseResponse.builder()
                .id(roomUserProjection.getBoardingHouseId())
                .name(roomUserProjection.getBoardingHouseName())
                .address(roomUserProjection.getAddress())
                .waterPrice(roomUserProjection.getWaterPrice())
                .electricityPrice(roomUserProjection.getElectricityPrice())
                .features(roomUserProjection.getFeatures())
                .build();
        boardingHouse.setAddress(roomUserProjection.getAddress());

        //get expenses
        List<ExpensesResponse> expenses = expensesRepository.findByEntityIdAndEntityTypeAndStatusOrderByDateUpdatedDesc(roomUserProjection.getRoomId(), EntityType.ROOM.getValue(), CommonStatus.ACTIVE.getValue())
                .stream().map(expensesMapper::toExpensesResponse).toList();

        return MyRoomResponse.builder()
                .host(user)
                .roomDetail(roomDetail)
                .expenses(expenses)
                .boardingHouse(boardingHouse)
                .build();
    }
}
