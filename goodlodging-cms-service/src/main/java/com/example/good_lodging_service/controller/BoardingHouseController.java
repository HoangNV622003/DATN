package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.BoardingHouse.BoardingHouseRequest;
import com.example.good_lodging_service.dto.request.BoardingHouse.BoardingHouseUpdateRequest;
import com.example.good_lodging_service.dto.request.BoardingHouse.ChangeOwnerRequest;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseDetailResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.service.BoardingHouseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boarding-houses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BoardingHouseController {
    BoardingHouseService boardingHouseService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<BoardingHouseDetailResponse> createBoardingHouse(@ModelAttribute BoardingHouseRequest request) {
        return ResponseEntity.ok(boardingHouseService.createBoardingHouse(request));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<BoardingHouseDetailResponse> updateBoardingHouse(@PathVariable Long id, @ModelAttribute BoardingHouseRequest request) {
        return ResponseEntity.ok(boardingHouseService.updateBoardingHouse(id, request));
    }

    @PatchMapping("/{id}/change-owner")
    public ResponseEntity<CommonResponse> changeOwner(@PathVariable Long id, @RequestBody ChangeOwnerRequest request) {
        return ResponseEntity.ok(boardingHouseService.changeBoardingHouseOwner(id,request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardingHouseDetailResponse> getBoardingHouseById(@PathVariable Long id) {
        return ResponseEntity.ok(boardingHouseService.getDetailBoardingHouse(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CommonResponse> deleteBoardingHouse(@PathVariable Long id) {
        return ResponseEntity.ok(boardingHouseService.deleteBoardingHouse(List.of(id)));
    }


}
