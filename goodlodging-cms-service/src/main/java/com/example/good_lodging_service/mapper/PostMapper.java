package com.example.good_lodging_service.mapper;

import com.example.good_lodging_service.dto.request.Post.PostRequest;
import com.example.good_lodging_service.dto.request.Post.PostUpdateRequest;
import com.example.good_lodging_service.dto.response.Post.PostDetailResponse;
import com.example.good_lodging_service.dto.response.Post.PostProjection;
import com.example.good_lodging_service.dto.response.Post.PostResponse;
import com.example.good_lodging_service.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mapping(target = "status", ignore = true)
    Post toPost(PostRequest request);
    PostDetailResponse toPostDetailResponse(Post post);
    PostResponse toPostResponse(Post post);
    @Mapping(target = "userId",ignore = true)
    @Mapping(target = "boardingHouseId",ignore = true)
    void updatePost(@MappingTarget Post post, PostUpdateRequest postRequest);
}
