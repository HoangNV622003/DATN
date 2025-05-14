package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.ApiResponse;
import com.example.good_lodging_service.dto.request.Auth.ResetPasswordRequest;
import com.example.good_lodging_service.dto.request.Auth.UpdatePasswordRequest;
import com.example.good_lodging_service.dto.request.User.UserCreateRequest;
import com.example.good_lodging_service.dto.request.User.UserUpdateRequest;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseDetailResponse;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getUsers(@PageableDefault(size = 15, sort = "dateUpdated", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserCreateRequest requestDTO) {
        return ResponseEntity.ok(userService.createUser(requestDTO));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @PutMapping(consumes = "multipart/form-data", value = "/{userId}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long userId, @ModelAttribute UserUpdateRequest requestDTO) {
        return ResponseEntity.ok(userService.updateUser(userId, requestDTO));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<CommonResponse> deleteUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.deleteUser(userId));
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<CommonResponse> updatePassword(@PathVariable Long userId, @RequestBody UpdatePasswordRequest requestDTO) {
        return ResponseEntity.ok(userService.updatePassword(userId, requestDTO));
    }

    @PatchMapping("/reset-password")
    public ResponseEntity<CommonResponse> resetPassword(@RequestBody ResetPasswordRequest requestDTO) {
        return ResponseEntity.ok(userService.resetPassword(requestDTO));
    }
    @GetMapping("/{userId}/boarding-house")
    public ResponseEntity<List<BoardingHouseResponse>> getMyBoardingHouse(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getMyBoardingHouses(userId));
    }

    @GetMapping("/existed")
    public ResponseEntity<Integer> findUser(@RequestParam String email, @RequestParam String phone, @RequestParam String username) {
        return ResponseEntity.ok(userService.findByEmailAndPhoneAndUsername(email, phone, username));
    }
}
