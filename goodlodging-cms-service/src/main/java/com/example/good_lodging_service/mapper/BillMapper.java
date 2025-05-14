package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.request.Bill.BillRequest;
import com.example.good_lodging_service.dto.response.Bill.BillResponse;
import com.example.good_lodging_service.entity.Bill;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BillMapper {
    BillResponse toPaymentTransactionResponse(Bill bill);
    Bill toPaymentTransaction(BillRequest billRequest);
}
