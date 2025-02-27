package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.request.Room.RoomRequest;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import com.example.good_lodging_service.entity.Room;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    Room toRoom(RoomRequest requestDTO);
    RoomResponse toRoomResponseDTO(Room room);
}
