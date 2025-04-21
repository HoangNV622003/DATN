package com.example.good_lodging_service.dto.response.Room;

import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.Expenses.ExpensesResponse;
import com.example.good_lodging_service.dto.response.PaymentTransaction.PaymentTransactionResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.entity.BoardingHouse;
import com.example.good_lodging_service.entity.Expenses;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MyRoomResponse {
    RoomDetailResponse roomDetail;
    UserResponseDTO host;
    BoardingHouseResponse boardingHouse;
    List<PaymentTransactionResponse> payments;
}
