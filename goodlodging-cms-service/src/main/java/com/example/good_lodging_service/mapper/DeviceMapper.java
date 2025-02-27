package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.request.Device.DeviceRequest;
import com.example.good_lodging_service.dto.response.Device.DeviceResponse;
import com.example.good_lodging_service.entity.Device;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DeviceMapper {
    Device toDevice(DeviceRequest requestDTO);
    DeviceResponse toDeviceResponseDTO(Device device);
}
