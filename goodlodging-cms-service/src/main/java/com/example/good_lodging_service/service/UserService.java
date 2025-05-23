package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.Authorities;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.EntityType;
import com.example.good_lodging_service.dto.request.Auth.ResetPasswordRequest;
import com.example.good_lodging_service.dto.request.Auth.UpdatePasswordRequest;
import com.example.good_lodging_service.dto.request.User.UserCreateRequest;
import com.example.good_lodging_service.dto.request.User.UserUpdateRequest;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Image.ImageResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.entity.*;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.AddressMapper;
import com.example.good_lodging_service.mapper.BoardingHouseMapper;
import com.example.good_lodging_service.mapper.RoomMapper;
import com.example.good_lodging_service.mapper.UserMapper;
import com.example.good_lodging_service.repository.*;
import com.example.good_lodging_service.utils.ValueUtils;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    private final UserMapper userMapper;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    AddressMapper addressMapper;
    AddressRepository addressRepository;
    ImageRepository imageRepository;
    BoardingHouseRepository boardingHouseRepository;
    BoardingHouseMapper boardingHouseMapper;
    UploadService uploadService;

    public UserResponseDTO createUser(UserCreateRequest request) {
        // find user by username, email, phone
        if (userRepository.existByUsernameOrEmailOrPhoneWithQuery(request.getUsername(), request.getEmail(), request.getPhone(), CommonStatus.ACTIVE.getValue()) > 0) {
            throw new AppException(ApiResponseCode.USER_ALREADY_EXISTS);
        }


        //save user
        User user = userMapper.toUser(request);
        user.setStatus(CommonStatus.ACTIVE.getValue());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<Role> roles = new HashSet<>();
        roleRepository.findById(Authorities.CUSTOMER.name()).ifPresent(roles::add);
        user.setRoles(roles);
        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    public UserResponseDTO updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findByIdAndStatus(id, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.USER_NOT_FOUND));

        if (userRepository.existsByEmailOrPhoneAndIdNotWithQuery(request.getEmail(), request.getPhone(), CommonStatus.ACTIVE.getValue(), id) > 0) {
            throw new AppException(ApiResponseCode.EMAIL_OR_PHONE_NUMBER_ALREADY_EXISTS);
        }
        Image image = imageRepository.findByEntityIdAndEntityTypeAndStatus(user.getId(), EntityType.USER.getValue(), CommonStatus.ACTIVE.getValue()).orElse(null);
        String imageUrl = image != null ? image.getImageUrl() : "";
        userMapper.updateUser(user, request);
        UserResponseDTO userResponse = userMapper.toUserResponse(userRepository.save(user));
        userResponse.setImageUrl(request.getImageFile() != null ? uploadAvatar(id, request.getImageFile()).getImageUrl() : imageUrl);
        return userResponse;
    }

    public Image uploadAvatar(Long userId, MultipartFile file) {
        Image image = imageRepository.findByEntityIdAndEntityTypeAndStatus(userId, EntityType.USER.getValue(), CommonStatus.ACTIVE.getValue()).orElse(null);
        if (image != null) {
            uploadService.removeFiles(List.of(image));
        }
        return uploadService.uploadImage(userId, EntityType.USER.getValue(), file);
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
        User user = findById(id);
        UserResponseDTO userResponseDTO = userMapper.toUserResponse(user);
        Image image = imageRepository.findByEntityIdAndEntityTypeAndStatus(user.getId(), EntityType.USER.getValue(), CommonStatus.ACTIVE.getValue()).orElse(null);
        userResponseDTO.setImageUrl(image != null ? image.getImageUrl() : "");
        return userResponseDTO;
    }

    public CommonResponse deleteUser(Long id) {
        //delete user
        User user = findById(id);
        user.setStatus(CommonStatus.DELETED.getValue());
        userRepository.save(user);
        //delete boarding-house

        //delete address
        return CommonResponse.builder().result(ApiResponseCode.USER_DELETED_SUCCESSFULLY.getMessage()).build();
    }

    public List<UserResponseDTO> getAllUsers(Pageable pageable) {
        return findAll(pageable).stream().map(userMapper::toUserResponse).toList();
    }

    public Integer findByEmailAndPhoneAndUsername(String email, String phone, String username) {
        return userRepository.existByUsernameOrEmailOrPhoneWithQuery(username, email, phone, CommonStatus.ACTIVE.getValue());
    }

    public List<BoardingHouseResponse> getMyBoardingHouses(Long userId) {
        // Lấy danh sách nhà trọ đang hoạt động
        List<BoardingHouse> boardingHouses = boardingHouseRepository.findAllByUserIdAndStatus(userId, CommonStatus.ACTIVE.getValue());
        if (boardingHouses.isEmpty()) {
            return Collections.emptyList();
        }

        // Lấy danh sách ID
        List<Long> boardingHouseIds = boardingHouses.stream()
                .map(BoardingHouse::getId)
                .collect(Collectors.toList());

        Set<Long> addressIds = boardingHouses.stream()
                .map(BoardingHouse::getAddressId)
                .collect(Collectors.toSet());

        // Lấy hình ảnh và nhóm theo ID nhà trọ
        List<Image> images = imageRepository.findAllByEntityIdInAndEntityTypeAndStatus(
                boardingHouseIds, EntityType.BOARDING_HOUSE.getValue(), CommonStatus.ACTIVE.getValue());

        Map<Long, List<String>> imageUrlMap = images.stream()
                .collect(Collectors.groupingBy(
                        Image::getEntityId,
                        Collectors.mapping(Image::getImageUrl, Collectors.toList())
                ));

        // Lấy địa chỉ và ánh xạ theo ID
        Map<Long, Address> addressMap = addressRepository.findAllById(addressIds).stream()
                .collect(Collectors.toMap(Address::getId, address -> address));

        return convertToListBoardingHouseResponse(boardingHouses, imageUrlMap, addressMap);
    }

    private List<BoardingHouseResponse> convertToListBoardingHouseResponse(List<BoardingHouse> boardingHouses, Map<Long, List<String>> imageUrlMap, Map<Long, Address> addressMap) {
        // Chuyển đổi sang DTO
        List<BoardingHouseResponse> responses = boardingHouses.stream()
                .map(boardingHouseMapper::toBoardingHouseResponse)
                .toList();

        Map<Long, BoardingHouse> boardingHouseMap = new HashMap<>();
        boardingHouses.forEach(boardingHouse -> {
            boardingHouseMap.put(boardingHouse.getId(), boardingHouse);
        });
        // Gán hình ảnh và địa chỉ vào response
        responses.forEach(response -> {
            response.setImageUrl(imageUrlMap.getOrDefault(response.getId(), Collections.emptyList()));
            BoardingHouse boardingHouse = boardingHouseMap.get(response.getId());
            Long addressId = boardingHouse != null ? boardingHouse.getAddressId() : null;
            Address address = addressId != null ? addressMap.get(addressId) : null;
            response.setAddress(address != null ? address.getFullAddress() : "");
        });
        return responses;
    }

    public CommonResponse resetPassword(ResetPasswordRequest requestDTO) {
        User user = userRepository.findByEmailAndStatus(requestDTO.getEmail(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.USER_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        userRepository.save(user);
        return CommonResponse.builder().result("Cập nhật mật khẩu thành công").build();
    }
}
