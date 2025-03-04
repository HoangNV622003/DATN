package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.dto.request.Room.RoomRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import com.example.good_lodging_service.entity.Room;
import com.example.good_lodging_service.entity.RoomUser;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.RoomMapper;
import com.example.good_lodging_service.repository.RoomRepository;
import com.example.good_lodging_service.repository.RoomUserRepository;
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

    public RoomResponse createRoom(RoomRequest request) {
        if (roomRepository.existsByNameAndBoardingHouseIdAndStatus(request.getName(), request.getBoardingHouseId(), CommonStatus.ACTIVE.getValue()))
            throw new AppException(ApiResponseCode.ROOM_ALREADY_EXITED);
        Room room = roomMapper.toRoom(request);
        room.setStatus(CommonStatus.ACTIVE.getValue());
        return roomMapper.toRoomResponseDTO(roomRepository.save(room));
    }

    public RoomResponse getRoomDetail(Long roomId) {
        return roomMapper.toRoomResponseDTO(findById(roomId));
    }

    private Room findById(Long roomId) {
        return roomRepository.findByIdAndStatus(roomId,CommonStatus.ACTIVE.getValue()).orElseThrow(() -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
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

    public CommonResponse deleteRoom(List<Long> roomIds) {
        List<Room> rooms = roomRepository.findAllById(roomIds);
        rooms.forEach(room -> {
            room.setStatus(CommonStatus.DELETED.getValue());
        });
        roomRepository.saveAll(rooms);
        return CommonResponse.builder().result(ApiResponseCode.ROOM_DELETED_SUCCESSFUL.getMessage()).build();
    }
}
