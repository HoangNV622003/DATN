package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.EntityDelete.EntityDeleteRequest;
import com.example.good_lodging_service.dto.request.Room.RoomRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Room.MyRoomResponse;
import com.example.good_lodging_service.dto.response.Room.RoomDetailResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import com.example.good_lodging_service.service.RoomService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomController {
    RoomService roomService;

    @PostMapping
    ResponseEntity<RoomResponse> createRoom(@RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.createRoom(request));
    }

    @PutMapping("/{roomId}")
    ResponseEntity<RoomResponse> updateRoom(@PathVariable Long roomId, @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(roomId, request));
    }

    @DeleteMapping
    ResponseEntity<CommonResponse> deleteRoom(@RequestBody EntityDeleteRequest request, @RequestParam(name = "boardingHouseId") Long boardingHouseId) {
        return ResponseEntity.ok(roomService.deleteRoom(boardingHouseId, request));
    }

    @GetMapping("/{roomId}")
    ResponseEntity<RoomDetailResponse> getRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getRoomDetail(roomId));
    }

    @GetMapping("/my-room/{userId}")
    ResponseEntity<MyRoomResponse> getMyRoom(@PathVariable Long userId) {
        return ResponseEntity.ok(roomService.getMyRoom(userId));
    }
}
