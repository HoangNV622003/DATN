package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.RoomUser.RoomUserDeleteRequest;
import com.example.good_lodging_service.dto.request.RoomUser.RoomUserRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.service.RoomUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/room-user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomUserController {
    RoomUserService roomUserService;

    @PostMapping
    public ResponseEntity<UserResponseDTO> addUser(@RequestBody RoomUserRequest roomUserRequest) {
        return ResponseEntity.ok(roomUserService.addUser(roomUserRequest));
    }

    @DeleteMapping
    public ResponseEntity<CommonResponse> deleteUser(@RequestBody RoomUserDeleteRequest roomUserRequest) {
        return ResponseEntity.ok(roomUserService.removeUser(roomUserRequest));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<List<UserResponseDTO>> getUsersWithRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomUserService.findAllByRoomId(roomId));
    }
}
