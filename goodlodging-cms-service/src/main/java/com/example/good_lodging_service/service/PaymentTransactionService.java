package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.PaymentStatus;
import com.example.good_lodging_service.dto.request.Payment.PaymentTransactionRequest;
import com.example.good_lodging_service.dto.response.Invoice.InvoiceResponse;
import com.example.good_lodging_service.dto.response.PaymentTransaction.PaymentTransactionResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.entity.*;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.PaymentTransactionMapper;
import com.example.good_lodging_service.mapper.UserMapper;
import com.example.good_lodging_service.repository.BoardingHouseRepository;
import com.example.good_lodging_service.repository.PaymentTransactionRepository;
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
public class PaymentTransactionService {
    PaymentTransactionRepository paymentTransactionRepository;
    PaymentTransactionMapper paymentTransactionMapper;
    BoardingHouseRepository boardingHouseRepository;
    UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final UserMapper userMapper;

    public InvoiceResponse findAllByRoomId(Long roomId) {
        List<PaymentTransaction> paymentTransactions = paymentTransactionRepository.findAllByRoomIdAndStatusNot(roomId, PaymentStatus.DELETED.getValue());
        Room room = roomRepository.findByIdAndStatus(roomId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ROOM_NOT_FOUND));
        List<Long> payerIds = paymentTransactions.stream().map(PaymentTransaction::getPayerId).toList();
        List<User> users = userRepository.findAllByIdInAndStatus(payerIds, CommonStatus.ACTIVE.getValue());
        Map<Long, User> userMap = new HashMap<>();
        users.forEach(user -> {
            userMap.put(user.getId(), user);
        });
        List<PaymentTransactionResponse> invoices = paymentTransactions.stream().map(paymentTransaction
                -> convertToPaymentTransactionResponse(userMap.get(paymentTransaction.getPayerId()), paymentTransaction)).toList();
        return InvoiceResponse.builder()
                .roomId(roomId)
                .roomName(room.getName())
                .members(findAllMembers(roomId))
                .invoices(invoices)
                .build();
    }

    public InvoiceResponse findAllByUserId(Long userId) {
        List<PaymentTransaction> paymentTransactions = paymentTransactionRepository.findAllByUserIdAndStatusNotWithQuery(userId, PaymentStatus.DELETED.getValue());
        Room room = roomRepository.findByUserIdAndStatusWithQuery(userId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ROOM_NOT_FOUND));
        List<Long> payerIds = paymentTransactions.stream().map(PaymentTransaction::getPayerId).toList();
        List<User> users = userRepository.findAllByIdInAndStatus(payerIds, CommonStatus.ACTIVE.getValue());
        Map<Long, User> userMap = new HashMap<>();
        users.forEach(user -> {
            userMap.put(user.getId(), user);
        });
        List<PaymentTransactionResponse> invoices = paymentTransactions.stream().map(paymentTransaction
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
    public PaymentTransactionResponse confirmPayment(Long id, Long userId) {
        PaymentTransaction paymentTransaction = paymentTransactionRepository.findByIdAndStatusNot(id, PaymentStatus.DELETED.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        paymentTransaction.setStatus(PaymentStatus.PAID.getValue()); // đã thanh toán xong
        paymentTransaction.setPayerId(userId);// id của người thanh toán
        paymentTransaction.setPaymentDate(Instant.now());
        paymentTransactionRepository.save(paymentTransaction);
        User user = userRepository.findByIdAndStatus(userId, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.USER_NOT_FOUND));
        return convertToPaymentTransactionResponse(user, paymentTransaction);
    }

    public PaymentTransactionResponse createPaymentTransaction(PaymentTransactionRequest paymentTransactionRequest) {
        Room room = roomRepository.findByIdAndStatus(paymentTransactionRequest.getRoomId(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ROOM_NOT_FOUND));
        BoardingHouse boardingHouse = boardingHouseRepository.findByIdAndStatus(room.getBoardingHouseId(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        PaymentTransaction paymentTransaction = paymentTransactionMapper.toPaymentTransaction(paymentTransactionRequest);
        paymentTransaction.setRoomRent(room.getPrice());
        paymentTransaction.setElectricityPrice(boardingHouse.getElectricityPrice());
        paymentTransaction.setWaterPrice(boardingHouse.getWaterPrice());
        paymentTransaction.setOtherPrice(boardingHouse.getOtherPrice());
        paymentTransaction.setOtherPrice(boardingHouse.getOtherPrice());
        paymentTransaction.setStatus(PaymentStatus.PENDING.getValue());
        paymentTransactionRepository.save(paymentTransaction);
        return convertToPaymentTransactionResponse(null, paymentTransaction);
    }

    public PaymentTransactionResponse updatePaymentTransaction(Long id, PaymentTransactionRequest paymentTransactionRequest) {
        PaymentTransaction paymentTransaction = paymentTransactionRepository.findByIdAndStatusNot(id, PaymentStatus.DELETED.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        paymentTransaction.setDescription(paymentTransactionRequest.getDescription());
        paymentTransaction.setDueDate(paymentTransactionRequest.getDueDate());
        paymentTransaction.setFineAmount(paymentTransactionRequest.getFineAmount());
        paymentTransaction.setElectricityUsage(paymentTransactionRequest.getElectricityUsage());
        paymentTransaction.setWaterUsage(paymentTransactionRequest.getWaterUsage());
        paymentTransactionRepository.save(paymentTransaction);
        return convertToPaymentTransactionResponse(null, paymentTransaction);
    }

    private PaymentTransactionResponse convertToPaymentTransactionResponse(User user, PaymentTransaction paymentTransaction) {
        PaymentTransactionResponse paymentTransactionResponse = paymentTransactionMapper.toPaymentTransactionResponse(paymentTransaction);
        paymentTransactionResponse.setPayerName(user != null ? user.getFirstName() + " " + user.getLastName() : "");
        return paymentTransactionResponse;
    }
}
