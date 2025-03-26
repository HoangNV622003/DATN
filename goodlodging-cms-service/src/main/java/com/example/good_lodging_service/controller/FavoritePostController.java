package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.FavoritePost.FavoritePostDeleteRequest;
import com.example.good_lodging_service.dto.request.FavoritePost.FavoritePostRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Post.PostProjection;
import com.example.good_lodging_service.service.FavoritePostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/favorite-posts")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoritePostController {
    FavoritePostService favoritePostService;

    @GetMapping("/{id}")
    public ResponseEntity<List<PostProjection>> findByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(favoritePostService.findAllByUserId(id));
    }

    @PostMapping
    public ResponseEntity<CommonResponse> create(@RequestBody FavoritePostRequest postRequest) {
        return ResponseEntity.ok(favoritePostService.createFavoritePost(postRequest));
    }

    @DeleteMapping
    public ResponseEntity<CommonResponse> delete(@RequestBody FavoritePostDeleteRequest request) {
        return ResponseEntity.ok(favoritePostService.deleteFavoritePost(request));
    }
}
