package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.Address.AddressRequest;
import com.example.good_lodging_service.dto.response.Address.AddressDetailResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.service.AddressService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressController {
    AddressService addressService;

    @PostMapping
    public ResponseEntity<AddressDetailResponse> createAddress(@RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.createAddress(request));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressDetailResponse> updateAddress(@PathVariable Long addressId, @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.updateAddress(addressId, request));
    }

    @GetMapping("/{addressId}")
    public ResponseEntity<AddressDetailResponse> getAddress(@PathVariable Long addressId) {
        return ResponseEntity.ok(addressService.getAddress(addressId));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<CommonResponse> deleteAddress(@PathVariable Long addressId) {
        return ResponseEntity.ok(addressService.deleteAddress(addressId));
    }
}
