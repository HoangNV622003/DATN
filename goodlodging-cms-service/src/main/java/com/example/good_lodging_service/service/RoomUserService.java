package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.EntityType;
import com.example.good_lodging_service.dto.request.RoomUser.RoomUserDeleteRequest;
import com.example.good_lodging_service.dto.request.RoomUser.RoomUserRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Image.ImageResponse;
import com.example.good_lodging_service.dto.response.Member.MemberProjection;
import com.example.good_lodging_service.dto.response.Member.MemberResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.entity.Image;
import com.example.good_lodging_service.entity.Room;
import com.example.good_lodging_service.entity.RoomUser;
import com.example.good_lodging_service.entity.User;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.UserMapper;
import com.example.good_lodging_service.repository.ImageRepository;
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
    ImageRepository imageRepository;
    public List<MemberResponse> findAllByRoomId(Long roomId) {
        return roomUserRepository.findAllByRoomIdAndStatusWithQuery(roomId, CommonStatus.ACTIVE.getValue())
                .stream().map(MemberResponse::fromMemberProjection).toList();
    }

    public UserResponseDTO addUser(RoomUserRequest request) {
        Room room = roomRepository.findByIdAndStatus(request.getRoomId(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ROOM_NOT_FOUND));
        User user = userRepository.findByUsernameAndStatus(request.getUsername(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.USER_NOT_FOUND));
        if (roomUserRepository.existsByUserIdAndStatus(user.getId(), CommonStatus.ACTIVE.getValue())) {
            throw new AppException(ApiResponseCode.USER_ALREADY_EXISTS);
        }

        roomUserRepository.save(RoomUser.builder()
                .roomId(room.getId())
                .userId(user.getId())
                .status(CommonStatus.ACTIVE.getValue())
                .build());
        return userMapper.toUserResponse(user);
    }

    public CommonResponse removeUser(RoomUserDeleteRequest request) {
        RoomUser roomUser = roomUserRepository.findByUserIdAndRoomIdAndStatus(request.getUserId(), request.getRoomId(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));

        roomUser.setStatus(CommonStatus.DELETED.getValue());
        roomUserRepository.save(roomUser);
        return CommonResponse.builder().status(200).result(ApiResponseCode.DELETE_ROOM_USER_SUCCESSFUL.getMessage()).build();
    }
}
