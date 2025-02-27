package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.dto.request.Address.AddressRequest;
import com.example.good_lodging_service.dto.response.Address.AddressResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.entity.Address;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.AddressMapper;
import com.example.good_lodging_service.repository.AddressRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressService {
    AddressRepository addressRepository;
    AddressMapper addressMapper;
    public AddressResponse createBoardingHouseAddress(AddressRequest addressRequest) {
        if (addressRepository.existsByHouseNumberAndStreetNameAndWardsIdAndDistrictIdAndProvinceIdAndStatus(
                addressRequest.getHouseNumber(),
                addressRequest.getStreet(),
                addressRequest.getWardsId(),
                addressRequest.getDistrictId(),
                addressRequest.getProvinceId(),
                CommonStatus.ACTIVE.getValue()))
            throw new AppException(ApiResponseCode.ADDRESS_ALREADY_EXISTS);
        return addressMapper.toAddressResponseDTO(addressRepository.save(addressMapper.toAddress(addressRequest)));
    }

    public AddressResponse updateBoardingHouseAddress(Long addressId, AddressRequest addressRequest) {
        if (addressRepository.existsByHouseNumberAndStreetNameAndWardsIdAndDistrictIdAndProvinceIdAndStatusAndIdNot(
                addressRequest.getHouseNumber(),
                addressRequest.getStreet(),
                addressRequest.getWardsId(),
                addressRequest.getDistrictId(),
                addressRequest.getProvinceId(),
                CommonStatus.ACTIVE.getValue(),
                addressId))
            throw new AppException(ApiResponseCode.ADDRESS_ALREADY_EXISTS);
        return addressMapper.toAddressResponseDTO(addressRepository.save(addressMapper.toAddress(addressRequest)));
    }

    public CommonResponse deleteBoardingHouseAddress(Long addressId){
        Address address = findById(addressId);
        address.setStatus(CommonStatus.DELETED.getValue());
        addressRepository.save(address);
        return CommonResponse.builder().result(ApiResponseCode.ADDRESS_DELETED_SUCCESSFULLY.getMessage()).build();
    }

    public Address findById(Long addressId) {
        return addressRepository.findById(addressId).orElseThrow(()-> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }

}
