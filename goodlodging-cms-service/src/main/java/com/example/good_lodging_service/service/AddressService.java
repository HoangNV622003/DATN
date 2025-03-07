package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.dto.request.Address.AddressRequest;
import com.example.good_lodging_service.dto.response.Address.*;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressService {
    AddressRepository addressRepository;
    AddressMapper addressMapper;
    public List<AddressDetailResponse> findAll(){
        List<AddressDetailProjection> addressDetailProjections = addressRepository.findAllByQuery();
        Map<Long, AddressDetailResponse> provinceMap = new HashMap<>();
        Map<Long, DistrictResponse> districtMap = new HashMap<>();

        for (AddressDetailProjection addressDetailProjection : addressDetailProjections) {
            Long provinceId = addressDetailProjection.getProvinceId();
            String provinceName = addressDetailProjection.getProvinceName();
            Long districtId = addressDetailProjection.getDistrictId();
            String districtName = addressDetailProjection.getDistrictName();
            Long wardsId = addressDetailProjection.getWardsId();
            String wardsName = addressDetailProjection.getWardsName();
            // Nhóm theo Province
            provinceMap.putIfAbsent(provinceId, new AddressDetailResponse(provinceId, provinceName, new ArrayList<>()));
            AddressDetailResponse province = provinceMap.get(provinceId);

            // Nhóm theo District
            districtMap.putIfAbsent(districtId, new DistrictResponse(districtId, districtName, new ArrayList<>()));
            DistrictResponse district = districtMap.get(districtId);

            // Thêm Wards vào District
            district.getWards().add(new WardsResponse(wardsId, wardsName));

            // Nếu District chưa có trong danh sách của Province thì thêm vào
            if (!province.getDistricts().contains(district)) {
                province.getDistricts().add(district);
            }
        }
        return new ArrayList<>(provinceMap.values());
    }
    public AddressResponse createAddress(AddressRequest addressRequest) {
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

    public AddressResponse updateAddress(Long addressId, AddressRequest addressRequest) {
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

    public AddressResponse getAddress(Long addressId) {
        return addressMapper.toAddressResponseDTO(findById(addressId));
    }
    public Address findById(Long addressId) {
        return addressRepository.findByIdAndStatus(addressId,CommonStatus.ACTIVE.getValue()).orElseThrow(()-> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }

}
