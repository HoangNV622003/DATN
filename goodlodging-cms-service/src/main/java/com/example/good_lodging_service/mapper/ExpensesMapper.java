package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.request.Expenses.ExpensesRequest;
import com.example.good_lodging_service.dto.response.Expenses.ExpensesResponse;
import com.example.good_lodging_service.entity.Expenses;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExpensesMapper {
    Expenses toExpenses(ExpensesRequest expensesRequest);
    ExpensesResponse toExpensesResponse(Expenses expenses);
}
