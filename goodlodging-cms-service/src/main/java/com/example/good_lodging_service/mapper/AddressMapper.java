package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.request.Address.AddressRequest;
import com.example.good_lodging_service.dto.response.Address.AddressResponse;
import com.example.good_lodging_service.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.lang.annotation.Target;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status",ignore = true)
    Address toAddress(AddressRequest requestDTO);
    AddressResponse toAddressResponseDTO(Address address);

    void updateAddress(@MappingTarget Address address,AddressRequest addressRequest);
}
