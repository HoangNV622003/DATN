package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.ApiResponse;
import com.example.good_lodging_service.dto.request.Auth.UpdatePasswordRequest;
import com.example.good_lodging_service.dto.request.User.UserCreateRequest;
import com.example.good_lodging_service.dto.request.User.UserUpdateRequest;
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
    public ApiResponse<List<UserResponseDTO>> getUsers(@PageableDefault(size = 15, sort = "dateUpdated",direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.<List<UserResponseDTO>>builder().result(userService.getAllUsers(pageable)).build();
    }

    @PostMapping
    public ApiResponse<UserResponseDTO> createUser(@RequestBody UserCreateRequest requestDTO) {
        return ApiResponse.<UserResponseDTO>builder().result(userService.createUser(requestDTO)).build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @PutMapping("/{userId}")
    public ApiResponse<UserResponseDTO> updateUser(@PathVariable Long userId,@RequestBody UserUpdateRequest requestDTO) {
        return ApiResponse.<UserResponseDTO>builder().result(userService.updateUser(userId,requestDTO)).build();
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<CommonResponse> deleteUser(@PathVariable Long userId) {
        return ApiResponse.<CommonResponse>builder().result(userService.deleteUser(userId)).build();
    }

    @PatchMapping("/{userId}")
    public ApiResponse<CommonResponse> updatePassword(@PathVariable Long userId, @RequestBody UpdatePasswordRequest requestDTO) {
        return ApiResponse.<CommonResponse>builder().result(userService.updatePassword(userId,requestDTO)).build();
    }
}
