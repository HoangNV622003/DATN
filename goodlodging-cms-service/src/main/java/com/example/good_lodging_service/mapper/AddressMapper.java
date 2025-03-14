package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.request.Address.AddressRequest;
import com.example.good_lodging_service.dto.response.Address.AddressResponse;
import com.example.good_lodging_service.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    Address toAddress(AddressRequest requestDTO);
    AddressResponse toAddressResponseDTO(Address address);
}
