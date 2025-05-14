package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.BillStatus;
import com.example.good_lodging_service.dto.request.Bill.BillRequest;
import com.example.good_lodging_service.dto.response.Invoice.InvoiceResponse;
import com.example.good_lodging_service.dto.response.Bill.BillResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.entity.*;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.BillMapper;
import com.example.good_lodging_service.mapper.UserMapper;
import com.example.good_lodging_service.repository.BoardingHouseRepository;
import com.example.good_lodging_service.repository.BillRepository;
import com.example.good_lodging_service.repository.RoomRepository;
import com.example.good_lodging_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillService {
    BillRepository billRepository;
    BillMapper billMapper;
    BoardingHouseRepository boardingHouseRepository;
    UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final UserMapper userMapper;

    public InvoiceResponse findAllByRoomId(Long roomId) {
        List<Bill> bills = billRepository.findAllByRoomIdAndStatusNot(roomId, BillStatus.DELETED.getValue());
        Room room = roomRepository.findByIdAndStatus(roomId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ROOM_NOT_FOUND));
        List<Long> payerIds = bills.stream().map(Bill::getPayerId).toList();
        List<User> users = userRepository.findAllByIdInAndStatus(payerIds, CommonStatus.ACTIVE.getValue());
        Map<Long, User> userMap = new HashMap<>();
        users.forEach(user -> {
            userMap.put(user.getId(), user);
        });
        List<BillResponse> invoices = bills.stream().map(paymentTransaction
                -> convertToPaymentTransactionResponse(userMap.get(paymentTransaction.getPayerId()), paymentTransaction)).toList();
        return InvoiceResponse.builder()
                .roomId(roomId)
                .roomName(room.getName())
                .members(findAllMembers(roomId))
                .invoices(invoices)
                .build();
    }

    public InvoiceResponse findAllByUserId(Long userId) {
        List<Bill> bills = billRepository.findAllByUserIdAndStatusNotWithQuery(userId, BillStatus.DELETED.getValue());
        Room room = roomRepository.findByUserIdAndStatusWithQuery(userId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ROOM_NOT_FOUND));
        List<Long> payerIds = bills.stream().map(Bill::getPayerId).toList();
        List<User> users = userRepository.findAllByIdInAndStatus(payerIds, CommonStatus.ACTIVE.getValue());
        Map<Long, User> userMap = new HashMap<>();
        users.forEach(user -> {
            userMap.put(user.getId(), user);
        });
        List<BillResponse> invoices = bills.stream().map(paymentTransaction
                -> convertToPaymentTransactionResponse(userMap.get(paymentTransaction.getPayerId()), paymentTransaction)).toList();
        return InvoiceResponse.builder()
                .roomId(room.getId())
                .roomName(room.getName())
                .members(findAllMembers(room.getId()))
                .invoices(invoices)
                .build();
    }

    private List<UserResponseDTO> findAllMembers(Long roomId){
        return userRepository.findAllByRoomIdAndStatusWithQuery(roomId, CommonStatus.ACTIVE.getValue()).stream().map(userMapper::toUserResponse).toList();
    }
    public BillResponse confirmPayment(Long id, Long userId) {
        Bill bill = billRepository.findByIdAndStatusNot(id, BillStatus.DELETED.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        bill.setStatus(BillStatus.PAID.getValue()); // đã thanh toán xong
        bill.setPayerId(userId);// id của người thanh toán
        bill.setPaymentDate(Instant.now());
        billRepository.save(bill);
        User user = userRepository.findByIdAndStatus(userId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.USER_NOT_FOUND));
        return convertToPaymentTransactionResponse(user, bill);
    }

    public BillResponse createPaymentTransaction(BillRequest billRequest) {
        Room room = roomRepository.findByIdAndStatus(billRequest.getRoomId(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ROOM_NOT_FOUND));
        BoardingHouse boardingHouse = boardingHouseRepository.findByIdAndStatus(room.getBoardingHouseId(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        Bill bill = billMapper.toPaymentTransaction(billRequest);
        bill.setRoomRent(room.getPrice());
        bill.setElectricityPrice(boardingHouse.getElectricityPrice());
        bill.setWaterPrice(boardingHouse.getWaterPrice());
        bill.setOtherPrice(boardingHouse.getOtherPrice());
        bill.setOtherPrice(boardingHouse.getOtherPrice());
        bill.setStatus(BillStatus.PENDING.getValue());
        billRepository.save(bill);
        return convertToPaymentTransactionResponse(null, bill);
    }

    public BillResponse updatePaymentTransaction(Long id, BillRequest billRequest) {
        Bill bill = billRepository.findByIdAndStatusNot(id, BillStatus.DELETED.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        bill.setDescription(billRequest.getDescription());
        bill.setDueDate(billRequest.getDueDate());
        bill.setFineAmount(billRequest.getFineAmount());
        bill.setElectricityUsage(billRequest.getElectricityUsage());
        bill.setWaterUsage(billRequest.getWaterUsage());
        billRepository.save(bill);
        return convertToPaymentTransactionResponse(null, bill);
    }

    private BillResponse convertToPaymentTransactionResponse(User user, Bill bill) {
        BillResponse billResponse = billMapper.toPaymentTransactionResponse(bill);
        billResponse.setPayerName(user != null ? user.getFirstName() + " " + user.getLastName() : "");
        return billResponse;
    }
}
