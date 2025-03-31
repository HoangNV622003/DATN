package com.example.good_lodging_service.dto.request.Expenses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExpensesRequest {
    Long roomId;

    String name;
    Float amount;
    Instant paymentDate;
    Instant dueDate;
    String notes;
}
