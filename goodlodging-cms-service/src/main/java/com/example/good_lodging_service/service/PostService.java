package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.EntityType;
import com.example.good_lodging_service.dto.request.Post.PostFilterRequest;
import com.example.good_lodging_service.dto.request.Post.PostRequest;
import com.example.good_lodging_service.dto.request.Post.PostUpdateRequest;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Post.PostDetailProjection;
import com.example.good_lodging_service.dto.response.Post.PostDetailResponse;
import com.example.good_lodging_service.dto.response.Post.PostProjection;
import com.example.good_lodging_service.dto.response.Post.PostResponse;
import com.example.good_lodging_service.dto.response.Profile.ProfileResponse;
import com.example.good_lodging_service.entity.Image;
import com.example.good_lodging_service.entity.Post;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.BoardingHouseMapper;
import com.example.good_lodging_service.mapper.PostMapper;
import com.example.good_lodging_service.mapper.ProfileMapper;
import com.example.good_lodging_service.mapper.RoomMapper;
import com.example.good_lodging_service.repository.*;
import com.example.good_lodging_service.utils.ValueUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    BoardingHouseRepository boardingHouseRepository;
    BoardingHouseMapper boardingHouseMapper;
    PostMapper postMapper;
    UserRepository userRepository;
    ProfileMapper profileMapper;
    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final ImageRepository imageRepository;

    public PostResponse createPost(PostRequest request) {
        Post post = postMapper.toPost(request);
        post.setStatus(CommonStatus.ACTIVE.getValue());
        post = postRepository.save(post);

        return postMapper.toPostResponse(post);
    }


    public PostResponse updatePost(Long id, PostUpdateRequest request) {

        Post post = findById(id);
        postMapper.updatePost(post, request);
        post = postRepository.save(post);
        return postMapper.toPostResponse(post);
    }

    public PostDetailResponse getPostDetailById(Long id) {
        PostDetailProjection postDetailProjection=postRepository.findByPostIdAndStatusWithQuery(id,CommonStatus.ACTIVE.getValue()).orElseThrow(
                ()->new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        List<Image> boardingHouseImageUrls=imageRepository.findAllByEntityIdAndEntityTypeAndStatus(postDetailProjection.getBoardingHouseId(), EntityType.BOARDING_HOUSE.getValue(), CommonStatus.ACTIVE.getValue());
        List<Image> roomImageUrls=imageRepository.findAllByEntityIdAndEntityTypeAndStatus(postDetailProjection.getRoomId(), EntityType.ROOM.getValue(), CommonStatus.ACTIVE.getValue());
        boardingHouseImageUrls.addAll(roomImageUrls);
        List<String> imageUrls=boardingHouseImageUrls.stream().map(Image::getImageUrl).toList();

        return PostDetailResponse.builder()
                .userProfile(ProfileResponse.fromPostDetailProjection(postDetailProjection))
                .title(ValueUtils.getOrDefault(postDetailProjection.getTitle(),""))
                .floor(ValueUtils.getOrDefault(postDetailProjection.getFloor(),0))
                .area(ValueUtils.getOrDefault(postDetailProjection.getArea(),0F))
                .boardingHouse(BoardingHouseResponse.fromPostDetailProjection(postDetailProjection))
                .imageUrl(imageUrls)
                .build();

    }


    public CommonResponse deletePost(Long id) {
        Post post = findById(id);
        post.setStatus(CommonStatus.DELETED.getValue());
        postRepository.save(post);
        return CommonResponse.builder().result(ApiResponseCode.POST_DELETED_SUCCESSFUL.getMessage()).build();
    }

    public Page<PostProjection> getAllPosts(Pageable pageable) {
        return postRepository.findAllByStatusWithQuery(CommonStatus.ACTIVE.getValue(), pageable);
    }

    public Page<PostProjection> getAllMyPosts(Long userId, Pageable pageable) {
        return postRepository.findAllByUserIdAndStatusWithQuery(userId, CommonStatus.ACTIVE.getValue(), pageable);
    }

    private Post findById(Long id) {
        return postRepository.findByIdAndStatus(id, CommonStatus.ACTIVE.getValue()).orElseThrow(() -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
    }


    public Page<PostProjection> searchPosts(PostFilterRequest request, Pageable pageable) {

        return !Objects.isNull(request)
                ? findByAddressAndFeature(request, pageable)
                : getAllPosts(pageable);
    }

    private Page<PostProjection> findByAddressAndFeature(PostFilterRequest filter, Pageable pageable) {
        validateFilter(filter);
        return postRepository.findAllByAddressAndFeaturesWithQuery(
                filter.getWardsId(),
                filter.getMinRoomRent(),
                filter.getMaxRoomRent(),
                filter.getMinArea(),
                filter.getMaxArea(),
                filter.getMinElectricityPrice(),
                filter.getMaxElectricityPrice(),
                filter.getMinWaterPrice(),
                filter.getMaxWaterPrice(),
                filter.getFeatures(),
                filter.getDescription(),
                pageable
        );
    }

    private void validateFilter(PostFilterRequest filter) {
        // Kiểm tra minRoomRent và maxRoomRent
        if (filter.getMinRoomRent() != null && filter.getMaxRoomRent() != null) {
            if (filter.getMinRoomRent() > filter.getMaxRoomRent()) {
                throw new AppException(ApiResponseCode.INVALID_ROOM_RENT);
            }
        }

        // Kiểm tra minArea và maxArea
        if (filter.getMinArea() != null && filter.getMaxArea() != null) {
            if (filter.getMinArea() > filter.getMaxArea()) {
                throw new AppException(ApiResponseCode.INVALID_AREA);
            }
        }

        // Kiểm tra minElectricityPrice và maxElectricityPrice
        if (filter.getMinElectricityPrice() != null && filter.getMaxElectricityPrice() != null) {
            if (filter.getMinElectricityPrice() > filter.getMaxElectricityPrice()) {
                throw new AppException(ApiResponseCode.INVALID_ELECTRICITY_PRICE);
            }
        }

        // Kiểm tra minWaterPrice và maxWaterPrice
        if (filter.getMinWaterPrice() != null && filter.getMaxWaterPrice() != null) {
            if (filter.getMinWaterPrice() > filter.getMaxWaterPrice()) {
                throw new AppException(ApiResponseCode.INVALID_WATER_PRICE);
            }
        }

        // Có thể thêm các kiểm tra khác nếu cần, ví dụ: giá trị âm
        if (filter.getMinRoomRent() != null && filter.getMinRoomRent() < 0) {
            throw new AppException(ApiResponseCode.INVALID_ROOM_RENT_NEGATIVE);
        }
        if (filter.getMaxRoomRent() != null && filter.getMaxRoomRent() < 0) {
            throw new AppException(ApiResponseCode.INVALID_ROOM_RENT_NEGATIVE);
        }
        if (filter.getMinArea() != null && filter.getMinArea() < 0) {
            throw new AppException(ApiResponseCode.INVALID_AREA_NEGATIVE);
        }
        if (filter.getMaxArea() != null && filter.getMaxArea() < 0) {
            throw new AppException(ApiResponseCode.INVALID_AREA_NEGATIVE);
        }
    }
}
