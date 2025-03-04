package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.dto.request.Address.AddressRequest;
import com.example.good_lodging_service.dto.response.Address.AddressDetailResponse;
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
    public AddressDetailResponse createAddress(AddressRequest addressRequest) {
        if (addressRepository.existsByHouseNumberAndStreetNameAndWardsIdAndDistrictIdAndProvinceIdAndBoardingHouseIdAndStatus(
                addressRequest.getHouseNumber(),
                addressRequest.getStreetName(),
                addressRequest.getWardsId(),
                addressRequest.getDistrictId(),
                addressRequest.getProvinceId(),
                addressRequest.getBoardingHouseId(),
                CommonStatus.ACTIVE.getValue()))
            throw new AppException(ApiResponseCode.ADDRESS_ALREADY_EXISTS);
        Address address = addressMapper.toAddress(addressRequest);
        address.setStatus(CommonStatus.ACTIVE.getValue());
        return addressMapper.toAddressResponseDTO(addressRepository.save(address));
    }

    public AddressDetailResponse updateAddress(Long addressId, AddressRequest addressRequest) {
        if (addressRepository.existsByHouseNumberAndStreetNameAndWardsIdAndDistrictIdAndProvinceIdAndBoardingHouseIdAndStatusAndIdNot(
                addressRequest.getHouseNumber(),
                addressRequest.getStreetName(),
                addressRequest.getWardsId(),
                addressRequest.getDistrictId(),
                addressRequest.getProvinceId(),
                addressRequest.getBoardingHouseId(),
                CommonStatus.ACTIVE.getValue(),
                addressId))
            throw new AppException(ApiResponseCode.ADDRESS_ALREADY_EXISTS);
        Address address = addressMapper.toAddress(addressRequest);
        address.setId(addressId);
        address.setStatus(CommonStatus.ACTIVE.getValue());
        return addressMapper.toAddressResponseDTO(addressRepository.save(address));
    }

    public CommonResponse deleteAddress(Long addressId){
        Address address = findById(addressId);
        address.setStatus(CommonStatus.DELETED.getValue());
        addressRepository.save(address);
        return CommonResponse.builder().result(ApiResponseCode.ADDRESS_DELETED_SUCCESSFULLY.getMessage()).build();
    }

    public AddressDetailResponse getAddress(Long addressId) {
        return addressMapper.toAddressResponseDTO(findById(addressId));
    }
    public Address findById(Long addressId) {
        return addressRepository.findByIdAndStatus(addressId,CommonStatus.ACTIVE.getValue()).orElseThrow(()-> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }

}
