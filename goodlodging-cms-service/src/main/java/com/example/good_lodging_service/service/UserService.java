package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.Authorities;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.KafkaConfigConstants;
import com.example.good_lodging_service.dto.request.Auth.UpdatePasswordRequest;
import com.example.good_lodging_service.dto.request.Notification.PushNotificationRequest;
import com.example.good_lodging_service.dto.request.User.UserCreateRequest;
import com.example.good_lodging_service.dto.request.User.UserUpdateRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.entity.Role;
import com.example.good_lodging_service.entity.User;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.UserMapper;
import com.example.good_lodging_service.repository.RoleRepository;
import com.example.good_lodging_service.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    private final UserMapper userMapper;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    KafkaTemplate<String, Object> kafkaTemplate;
    private final RoleRepository roleRepository;

    public UserResponseDTO createUser(UserCreateRequest request) {
        // find user by username, email, phone
        if (userRepository.existByUsernameOrEmailOrPhoneWithQuery(request.getUsername(), request.getEmail(), request.getPhone(), CommonStatus.ACTIVE.getValue()) > 0) {
            throw new AppException(ApiResponseCode.USER_ALREADY_EXISTS);
        }

        User user = userMapper.toUser(request);
        user.setStatus(CommonStatus.ACTIVE.getValue());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<Role> roles = new HashSet<>();
        roleRepository.findById(Authorities.CUSTOMER.name()).ifPresent(roles::add);
        user.setRoles(roles);
        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    public UserResponseDTO updateUser(Long id, UserUpdateRequest requestDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ApiResponseCode.USER_NOT_FOUND));

        if (userRepository.existsByEmailOrPhoneAndIdNotWithQuery(requestDTO.getEmail(), requestDTO.getPhone(), CommonStatus.ACTIVE.getValue(), id) > 0) {
            throw new AppException(ApiResponseCode.EMAIL_OR_PHONE_NUMBER_ALREADY_EXISTS);
        }

        userMapper.updateUser(user, requestDTO);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public CommonResponse updatePassword(Long id, UpdatePasswordRequest requestDTO) {
        User user = findById(id);

        if (!passwordEncoder.matches(requestDTO.getOldPassword(), user.getPassword())) {
            throw new AppException(ApiResponseCode.PASSWORD_MISMATCH);
        }

        user.setPassword(passwordEncoder.encode(requestDTO.getNewPassword()));
        return CommonResponse.builder().result(ApiResponseCode.PASSWORD_CHANGED_SUCCESSFULLY.getMessage()).build();
    }

    public User findById(Long id) {
        return userRepository.findByIdAndStatus(id, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }

    public List<User> findAll(Pageable pageable) {
        return userRepository.findAllByStatus(CommonStatus.ACTIVE.getValue(), pageable);
    }

    public UserResponseDTO getUser(Long id) {
        return userMapper.toUserResponse(findById(id));
    }

    public CommonResponse deleteUser(Long id) {
        User user = findById(id);
        user.setStatus(CommonStatus.DELETED.getValue());
        userRepository.save(user);
        return CommonResponse.builder().result(ApiResponseCode.USER_DELETED_SUCCESSFULLY.getMessage()).build();
    }

    public List<UserResponseDTO> getAllUsers(Pageable pageable) {
        return findAll(pageable).stream().map(userMapper::toUserResponse).toList();
    }
}
