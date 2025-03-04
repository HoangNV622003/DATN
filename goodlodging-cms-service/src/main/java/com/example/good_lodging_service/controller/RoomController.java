package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.Room.RoomRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
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
    ResponseEntity<RoomResponse> createRoom(@RequestBody RoomRequest request){
        return ResponseEntity.ok(roomService.createRoom(request));
    }

    @PutMapping("/{roomId}")
    ResponseEntity<RoomResponse> updateRoom(@PathVariable Long roomId, @RequestBody RoomRequest request){
        return ResponseEntity.ok(roomService.updateRoom(roomId, request));
    }

    @DeleteMapping
    ResponseEntity<CommonResponse> deleteRoom(@RequestBody List<Long> ids){
        return ResponseEntity.ok(roomService.deleteRoom(ids));
    }

    @GetMapping("/{roomId}")
    ResponseEntity<RoomResponse> getRoom(@PathVariable Long roomId){
        return ResponseEntity.ok(roomService.getRoomDetail(roomId));
    }

}
