package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.Device.DeviceRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Device.DeviceResponse;
import com.example.good_lodging_service.service.DeviceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DeviceController {
    DeviceService deviceService;

    @PostMapping
    public ResponseEntity<DeviceResponse> createDevice(@RequestBody DeviceRequest deviceRequest) {
        return ResponseEntity.ok(deviceService.createDevice(deviceRequest));
    }

    @GetMapping
    public ResponseEntity<List<DeviceResponse>> getAllDevices() {
        return ResponseEntity.ok(deviceService.getAllDevices());
    }

    @PutMapping("/{id}")
    ResponseEntity<DeviceResponse> updateDevice(@PathVariable Long id, @RequestBody DeviceRequest deviceRequest) {
        return ResponseEntity.ok(deviceService.updateDevice(id, deviceRequest));
    }

    @DeleteMapping
    ResponseEntity<CommonResponse> deleteDevice(@RequestBody List<Long> ids) {
        return ResponseEntity.ok(deviceService.deleteDevice(ids));
    }
}
