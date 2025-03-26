package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.dto.request.RoomUser.RoomUserRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.entity.Room;
import com.example.good_lodging_service.entity.RoomUser;
import com.example.good_lodging_service.entity.User;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.UserMapper;
import com.example.good_lodging_service.repository.RoomRepository;
import com.example.good_lodging_service.repository.RoomUserRepository;
import com.example.good_lodging_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomUserService {
    RoomUserRepository roomUserRepository;
    UserRepository userRepository;
    RoomRepository roomRepository;
    UserMapper userMapper;

    public List<UserResponseDTO> findAllByRoomId(Long roomId) {
        return roomUserRepository.findAllByRoomIdAndStatusWithQuery(roomId, CommonStatus.ACTIVE.getValue())
                .stream().map(userMapper::toUserResponse).toList();
    }

    public CommonResponse addUser(RoomUserRequest request) {
        if (!findByUserIdAndRoomId(request.getUserId(), request.getRoomId()))
            throw new AppException(ApiResponseCode.ENTITY_NOT_FOUND);
        roomUserRepository.save(RoomUser.builder()
                .roomId(request.getRoomId())
                .userId(request.getUserId())
                .status(CommonStatus.ACTIVE.getValue())
                .build());
        return CommonResponse.builder().status(200).result("Add user successful").build();
    }

    public CommonResponse removeUser(RoomUserRequest request) {
        if (!findByUserIdAndRoomId(request.getUserId(), request.getRoomId()))
            throw new AppException(ApiResponseCode.ENTITY_NOT_FOUND);

        RoomUser roomUser = roomUserRepository.findByUserIdAndRoomIdAndStatus(request.getUserId(), request.getRoomId(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));

        roomUser.setStatus(CommonStatus.DELETED.getValue());
        roomUserRepository.save(roomUser);
        return CommonResponse.builder().status(200).result("Remove user successful").build();
    }

    private boolean findByUserIdAndRoomId(Long userId, Long roomId) {
        User user = userRepository.findByIdAndStatus(userId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.USER_NOT_FOUND));

        Room room = roomRepository.findByIdAndStatus(roomId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ROOM_NOT_FOUND));

        return user != null && room != null;
    }
}
