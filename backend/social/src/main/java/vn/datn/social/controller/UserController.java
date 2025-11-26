package vn.datn.social.controller;

import vn.datn.social.dto.request.CreateUserRequestDTO;
import vn.datn.social.dto.response.UserResponseDTO;
import vn.datn.social.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

//    @PostMapping
//    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody CreateUserRequestDTO createUserRequestDTO) {
//        return ResponseEntity.ok(userService.createUser(createUserRequestDTO));
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<UserResponseDTO> getUser(@PathVariable Long id) {
//        return ResponseEntity.ok(userService.getUser(id));
//    }
}
