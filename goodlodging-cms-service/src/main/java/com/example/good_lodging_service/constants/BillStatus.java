package com.example.good_lodging_service.constants;

import lombok.Getter;

@Getter
public enum BillStatus {
    PENDING(0),     // Đang chờ thanh toán
    PAID(1),        // Đã thanh toán
    OVERDUE(2),     // Quá hạn thanh toán
    CANCELLED (3),
    DELETED(-3)
    ;  // Giao dịch bị huỷ
    private final int value;
    BillStatus(int value) {
        this.value = value;
    }
}
