package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.dto.request.Device.DeviceRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Device.DeviceResponse;
import com.example.good_lodging_service.entity.Device;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.DeviceMapper;
import com.example.good_lodging_service.repository.DeviceRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DeviceService {
    DeviceRepository deviceRepository;
    DeviceMapper mapper;
    private final DeviceMapper deviceMapper;

    public Device findById(Long id) {
        return deviceRepository.findByIdAndStatus(id, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }

    public DeviceResponse createDevice(DeviceRequest request) {
        if (deviceRepository.existsByNameAndStatus(request.getName(), CommonStatus.ACTIVE.getValue()))
            throw new AppException(ApiResponseCode.DEVICE_ALREADY_EXITED);
        Device device = deviceMapper.toDevice(request);
        device.setStatus(CommonStatus.ACTIVE.getValue());
        return deviceMapper.toDeviceResponseDTO(deviceRepository.save(device));
    }

    public DeviceResponse updateDevice(Long id, DeviceRequest request) {
        if (deviceRepository.existsByNameAndStatusAndIdNot(request.getName(), CommonStatus.ACTIVE.getValue(), id))
            throw new AppException(ApiResponseCode.DEVICE_ALREADY_EXITED);
        Device device = findById(id);
        device = deviceMapper.toDevice(request);
        device.setId(id);
        device.setStatus(CommonStatus.ACTIVE.getValue());
        return deviceMapper.toDeviceResponseDTO(deviceRepository.save(device));
    }

    public CommonResponse deleteDevice(List<Long> ids) {
        List<Device> devices = deviceRepository.findAllById(ids);
        devices.forEach(device -> device.setStatus(CommonStatus.DELETED.getValue()));
        deviceRepository.saveAll(devices);
        return CommonResponse.builder().result(ApiResponseCode.DEVICE_DELETED_SUCCESSFUL.getMessage()).build();
    }

    public List<DeviceResponse> getAllDevices() {
        return deviceRepository.findAllByStatus(CommonStatus.ACTIVE.getValue()).stream().map(mapper::toDeviceResponseDTO).toList();
    }
}
