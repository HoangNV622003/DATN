package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.BillStatus;
import com.example.good_lodging_service.constants.EntityType;
import com.example.good_lodging_service.dto.request.EntityDelete.EntityDeleteRequest;
import com.example.good_lodging_service.dto.request.Room.RoomRequest;
import com.example.good_lodging_service.dto.response.Bill.BillResponse;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Member.MemberResponse;
import com.example.good_lodging_service.dto.response.Room.MyRoomResponse;
import com.example.good_lodging_service.dto.response.Room.RoomConfigProjection;
import com.example.good_lodging_service.dto.response.Room.RoomDetailResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
import com.example.good_lodging_service.dto.response.RoomUser.RoomUserProjection;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.entity.*;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.BillMapper;
import com.example.good_lodging_service.mapper.RoomMapper;
import com.example.good_lodging_service.mapper.UserMapper;
import com.example.good_lodging_service.repository.*;
import com.example.good_lodging_service.utils.ValueUtils;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomService {
    RoomRepository roomRepository;
    RoomUserRepository roomUserRepository;
    RoomMapper roomMapper;
    UserMapper userMapper;
    UserRepository userRepository;
    private final BoardingHouseRepository boardingHouseRepository;
    BillRepository billRepository;
    BillMapper billMapper;
    private final ImageRepository imageRepository;

    public RoomResponse createRoom(RoomRequest request) {
        if (roomRepository.existsByNameAndBoardingHouseIdAndStatus(request.getName(), request.getBoardingHouseId(), CommonStatus.ACTIVE.getValue()))
            throw new AppException(ApiResponseCode.ROOM_ALREADY_EXITED);
        Room room = roomMapper.toRoom(request);
        room.setStatus(CommonStatus.ACTIVE.getValue());
        room = roomRepository.save(room);
        updateBoardingHouse(room.getBoardingHouseId());
        return roomMapper.toRoomResponseDTO(room);
    }

    public RoomDetailResponse getRoomDetail(Long roomId) {
        RoomResponse roomResponse = roomMapper.toRoomResponseDTO(findById(roomId));
        List<MemberResponse> memberResponses= roomUserRepository.findAllByRoomIdAndStatusWithQuery(roomId, CommonStatus.ACTIVE.getValue()).stream().map(MemberResponse::fromMemberProjection)
                .collect(Collectors.toList());

        return RoomDetailResponse.builder().room(roomResponse).users(memberResponses).build();
    }

    private Room findById(Long roomId) {
        return roomRepository.findByIdAndStatus(roomId, CommonStatus.ACTIVE.getValue()).orElseThrow(() -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }

    public RoomResponse updateRoom(Long roomId, RoomRequest request) {
        Room room = findById(roomId);
        if (roomRepository.existsByNameAndBoardingHouseIdAndStatusAndIdNot(request.getName(), request.getBoardingHouseId(), CommonStatus.ACTIVE.getValue(), room.getId()))
            throw new AppException(ApiResponseCode.ROOM_ALREADY_EXITED);
        room = roomMapper.toRoom(request);
        room.setId(roomId);
        room.setStatus(CommonStatus.ACTIVE.getValue());
        Room updatedRoom = roomRepository.save(room);
        updateBoardingHouse(request.getBoardingHouseId());
        return roomMapper.toRoomResponseDTO(updatedRoom);
    }

    public void updateBoardingHouse(Long boardingHouseId) {
        BoardingHouse boardingHouse = boardingHouseRepository.findById(boardingHouseId).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        RoomConfigProjection roomConfigProjection = roomRepository.findRoomConfigProjectionByBoardingHouseIdAndStatusWithQuery(boardingHouseId).orElse(null);
        boardingHouse.setMaxArea(roomConfigProjection != null ? ValueUtils.getOrDefault(roomConfigProjection.getMaxArea(),0F) : 0f);
        boardingHouse.setMinArea(roomConfigProjection != null ? ValueUtils.getOrDefault(roomConfigProjection.getMinArea(),0F): 0f);
        boardingHouse.setMaxRent(roomConfigProjection != null ? ValueUtils.getOrDefault(roomConfigProjection.getMaxRent(),0F) : 0f);
        boardingHouse.setMinRent(roomConfigProjection != null ? ValueUtils.getOrDefault(roomConfigProjection.getMinRent(),0F) : 0f);
        boardingHouseRepository.save(boardingHouse);
    }

    public CommonResponse deleteRoom(Long boardingHouseId, EntityDeleteRequest request) {
        List<Room> rooms = roomRepository.findAllById(request.getIds());
        List<Long>roomIds=rooms.stream().map(Room::getId).toList();
        if (roomUserRepository.existsByRoomIdInAndStatus(roomIds,CommonStatus.ACTIVE.getValue()))
            throw new AppException(ApiResponseCode.CANNOT_DELETE_ROOM);
        rooms.forEach(room -> {
            room.setStatus(CommonStatus.DELETED.getValue());
        });
        roomRepository.saveAll(rooms);
        List<RoomUser> roomUsers=roomUserRepository.findAllByRoomIdInAndStatus(roomIds,CommonStatus.ACTIVE.getValue());
        roomUsers.forEach(roomUser -> {
            roomUser.setStatus(CommonStatus.DELETED.getValue());
        });
        updateBoardingHouse(boardingHouseId);
        return CommonResponse.builder().result(ApiResponseCode.ROOM_DELETED_SUCCESSFUL.getMessage()).build();
    }

    private BillResponse convertToPaymentTransactionResponse(User user, Bill bill) {
        BillResponse billResponse = billMapper.toPaymentTransactionResponse(bill);
        billResponse.setPayerName(user != null ? user.getFirstName() + " " + user.getLastName() : "");
        return billResponse;
    }

    public List<BillResponse> findAllPaymentByRoomId(Long roomId) {
        List<Bill> bills = billRepository.findAllByRoomIdAndStatusNot(roomId, BillStatus.DELETED.getValue());

        List<Long> payerIds = bills.stream().map(Bill::getPayerId).toList();
        List<User> users = userRepository.findAllByIdInAndStatus(payerIds, CommonStatus.ACTIVE.getValue());
        Map<Long, User> userMap = new HashMap<>();
        users.forEach(user -> {
            userMap.put(user.getId(), user);
        });
        return bills.stream().map(paymentTransaction
                -> convertToPaymentTransactionResponse(userMap.get(paymentTransaction.getPayerId()), paymentTransaction)).toList();
    }

    public MyRoomResponse getMyRoom(Long userId) {
        RoomUserProjection roomUserProjection = roomUserRepository.findByUserIdAndStatusWithQuery(userId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));

        //get room
        RoomDetailResponse roomDetail = getRoomDetail(roomUserProjection.getRoomId());
        BoardingHouseResponse boardingHouse = BoardingHouseResponse.builder()
                .id(roomUserProjection.getBoardingHouseId())
                .name(roomUserProjection.getBoardingHouseName())
                .address(roomUserProjection.getAddress())
                .waterPrice(roomUserProjection.getWaterPrice())
                .electricityPrice(roomUserProjection.getElectricityPrice())
                .features(roomUserProjection.getFeatures())
                .address(roomUserProjection.getAddress())
                .build();

        UserResponseDTO user = findHostByRoomId(roomUserProjection.getRoomId());
        Image image = imageRepository.findByEntityIdAndEntityTypeAndStatus(user.getId(), EntityType.USER.getValue(), CommonStatus.ACTIVE.getValue()).orElse(null);

        user.setImageUrl(image != null ? image.getImageUrl() : "");
        return MyRoomResponse.builder()
                .host(user)
                .roomDetail(roomDetail)
                .payments(findAllPaymentByRoomId(roomUserProjection.getRoomId()))
                .boardingHouse(boardingHouse)
                .build();
    }

    public UserResponseDTO findHostByRoomId(Long roomId) {
        return userMapper.toUserResponse(userRepository.findByRoomIdAndStatusWithQuery(roomId, CommonStatus.ACTIVE.getValue())
                .orElseThrow(() -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND)));
    }
}
