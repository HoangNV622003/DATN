package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.dto.request.FavoritePost.FavoritePostDeleteRequest;
import com.example.good_lodging_service.dto.request.FavoritePost.FavoritePostRequest;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Post.PostProjection;
import com.example.good_lodging_service.entity.FavoritePost;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.repository.FavoritePostRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoritePostService {
    FavoritePostRepository favoritePostRepository;

    public CommonResponse createFavoritePost(FavoritePostRequest request) {
        if (favoritePostRepository.existsFavoritePostByPostIdAndUserIdAndStatus(request.getPostId(), request.getUserId(), CommonStatus.ACTIVE.getValue())) {
            throw new AppException(ApiResponseCode.FAVORITE_POST_ALREADY_EXISTED);
        }
        FavoritePost favoritePost = FavoritePost.builder()
                .userId(request.getUserId())
                .postId(request.getPostId())
                .status(CommonStatus.ACTIVE.getValue())
                .build();
        favoritePostRepository.save(favoritePost);
        return CommonResponse.builder()
                .status(200)
                .result(ApiResponseCode.ADD_FAVORITE_POST_SUCCESSFUL.getMessage())
                .build();
    }

    public List<PostProjection> findAllByUserId(Long userId) {
        return favoritePostRepository.findByUserIdWithQuery(userId, CommonStatus.ACTIVE.getValue());
    }

    public CommonResponse deleteFavoritePost(FavoritePostDeleteRequest request) {
        List<FavoritePost> favoritePosts = favoritePostRepository.findAllByPostIdInAndUserIdAndStatus(request.getPostIds(), request.getUserId(), CommonStatus.ACTIVE.getValue());
        favoritePosts.forEach(favoritePost -> favoritePost.setStatus(CommonStatus.DELETED.getValue()));
        favoritePostRepository.saveAll(favoritePosts);
        return CommonResponse.builder()
                .status(200)
                .result(ApiResponseCode.DELETE_FAVORITE_POST_SUCCESSFUL.getMessage())
                .build();
    }

}
