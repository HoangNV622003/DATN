package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.Post.PostFilterRequest;
import com.example.good_lodging_service.dto.request.Post.PostRequest;
import com.example.good_lodging_service.dto.request.Post.PostUpdateRequest;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Post.MyPostResponse;
import com.example.good_lodging_service.dto.response.Post.PostDetailResponse;
import com.example.good_lodging_service.dto.response.Post.PostProjection;
import com.example.good_lodging_service.dto.response.Post.PostResponse;
import com.example.good_lodging_service.service.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {
    PostService postService;

    @GetMapping
    public ResponseEntity<Page<PostProjection>> getPosts(
            @PageableDefault(size = 20, sort = "modifiedDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }

    @GetMapping("/my-posts/{userId}")
    public ResponseEntity<Page<PostProjection>> getMyPosts(
            @PathVariable Long userId,
            @PageableDefault(size = 15, sort = "modifiedDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(postService.getAllMyPosts(userId, pageable));
    }

    @GetMapping("/my-post/{postId}")
    public ResponseEntity<MyPostResponse> getMyPost(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getMyPost(postId));
    }
    @GetMapping("/{id}")
    public ResponseEntity<PostDetailResponse> getPostDetail(
            @PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostDetailById(id));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<PostResponse> createPost(
            @ModelAttribute PostRequest request) throws Exception {
        return ResponseEntity.ok(postService.createPost(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long id, @ModelAttribute PostRequest request) {
        return ResponseEntity.ok(postService.updatePost(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CommonResponse> deletePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.deletePost(id));
    }

    //this endpoint used to search data
    @PostMapping("/search")
    public ResponseEntity<Page<PostProjection>> searchPosts(
            @PageableDefault(size = 20, sort = "modifiedDate", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestBody(required = false) PostFilterRequest request
    ) {
        return ResponseEntity.ok(postService.searchPosts(request, pageable));
    }
}
