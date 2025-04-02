package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.EntityType;
import com.example.good_lodging_service.dto.request.Post.PostFilterRequest;
import com.example.good_lodging_service.dto.request.Post.PostRequest;
import com.example.good_lodging_service.dto.response.Address.AddressProjection;
import com.example.good_lodging_service.dto.response.AuthorInfo.AuthorInfo;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Post.*;
import com.example.good_lodging_service.dto.response.Profile.ProfileResponse;
import com.example.good_lodging_service.dto.response.User.UserResponseDTO;
import com.example.good_lodging_service.entity.*;
import com.example.good_lodging_service.exception.AppException;
import com.example.good_lodging_service.mapper.*;
import com.example.good_lodging_service.repository.*;
import com.example.good_lodging_service.utils.ValueUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

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
    UserMapper userMapper;
    BoardingHouseRepository bhRepository;
    AddressRepository addressRepository;

    @Value("${upload.uploadDir}")
    @NonFinal
    private String uploadDir;

    public PostResponse createPost(PostRequest request) throws Exception {
        //get address by boardingHouseId
        Address address = addressRepository.findByBoardingHouseIdAndStatusWithQuery(request.getBoardingHouseId(), CommonStatus.ACTIVE.getValue()).orElse(null);
        Post post = postMapper.toPost(request);
        post.setStatus(CommonStatus.ACTIVE.getValue());
        post.setAddress(address != null ? address.getFullAddress() : "");
        post.setImageUrl(uploadImage(request.getImageUrl()));
        post = postRepository.save(post);
        return postMapper.toPostResponse(post);
    }


    public PostResponse updatePost(Long id, PostRequest request) {

        Post post = findById(id);
        postMapper.updatePost(post, request);
        post.setImageUrl(request.getImageUrl() != null ? uploadImage(request.getImageUrl()) : post.getImageUrl());
        post = postRepository.save(post);
        return postMapper.toPostResponse(post);
    }

    public AuthorInfo getAuthorInformation(Long id, Pageable pageable) {
        User user = userRepository.findByIdAndStatus(id, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.USER_NOT_FOUND));
        Address address = addressRepository.findByIdAndStatus(user.getAddressId(), CommonStatus.ACTIVE.getValue()).orElse(null);
        UserResponseDTO userResponseDTO = userMapper.toUserResponse(user);
        userResponseDTO.setAddress(address != null ? address.getFullAddress() : "");
        return AuthorInfo.builder()
                .authorInfo(userResponseDTO)
                .posts(getAllMyPosts(id, pageable))
                .build();
    }

    public PostDetailResponse getPostDetailById(Long id) {
        PostDetailProjection postDetailProjection = postRepository.findByPostIdAndStatusWithQuery(id, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        List<Image> boardingHouseImageUrls = imageRepository.findAllByEntityIdAndEntityTypeAndStatus(postDetailProjection.getBoardingHouseId(), EntityType.BOARDING_HOUSE.getValue(), CommonStatus.ACTIVE.getValue());
        List<Image> roomImageUrls = imageRepository.findAllByEntityIdAndEntityTypeAndStatus(postDetailProjection.getRoomId(), EntityType.ROOM.getValue(), CommonStatus.ACTIVE.getValue());
        boardingHouseImageUrls.addAll(roomImageUrls);
        List<String> imageUrls = boardingHouseImageUrls.stream().map(Image::getImageUrl).toList();

        return PostDetailResponse.builder()
                .authorInfo(ProfileResponse.fromPostDetailProjection(postDetailProjection))
                .title(ValueUtils.getOrDefault(postDetailProjection.getTitle(), ""))
                .maxArea(ValueUtils.getOrDefault(postDetailProjection.getMaxArea(), 0F))
                .minArea(ValueUtils.getOrDefault(postDetailProjection.getMinArea(), 0F))
                .maxRent(ValueUtils.getOrDefault(postDetailProjection.getMaxRent(), 0F))
                .minRent(ValueUtils.getOrDefault(postDetailProjection.getMinRent(), 0F))
                .electricityPrice(ValueUtils.getOrDefault(postDetailProjection.getElectricityPrice(),0F))
                .waterPrice(ValueUtils.getOrDefault(postDetailProjection.getWaterPrice(),0F))
                .otherPrice(ValueUtils.getOrDefault(postDetailProjection.getOtherPrice(),0F))
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

    public MyPostResponse getMyPost(Long postId) {
        Post post = postRepository.findByIdAndStatus(postId, CommonStatus.ACTIVE.getValue()).orElseThrow(()
                -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        //get boarding house by userid
        List<BoardingHouse> boardingHouses = boardingHouseRepository.findAllByUserIdAndStatus(post.getUserId(), CommonStatus.ACTIVE.getValue());

        //get list boardingHouse ids
        List<Long> boardingHouseIds = boardingHouses.stream().map(BoardingHouse::getId).toList();

        //get address
        List<AddressProjection> addresses = addressRepository.findAllByBoardingHouseIdInWithQuery(boardingHouseIds);

        //get list images
        List<Image> images = imageRepository.findAllByEntityIdInAndEntityTypeAndStatus(boardingHouseIds, EntityType.BOARDING_HOUSE.getValue(), CommonStatus.ACTIVE.getValue());

        return MyPostResponse.builder().postResponse(postMapper.toPostResponse(post)).boardingHouses(convertToBoardingHouseResponse(boardingHouses, images, addresses)).build();
    }

    private List<BoardingHouseResponse> convertToBoardingHouseResponse(List<BoardingHouse> boardingHouses, List<Image> images, List<AddressProjection> addresses) {
        //map image
        Map<Long, List<String>> imageMap = new HashMap<>();
        images.forEach(image -> {
            imageMap.computeIfAbsent(image.getEntityId(), _ -> new ArrayList<>()).add(image.getImageUrl());
        });

        //map address
        Map<Long, String> addressMap = new HashMap<>();
        addresses.forEach(address -> {
            addressMap.put(address.getBoardingHouseId(), address.getFullAddress());
        });

        //convert boardingHouse to boardingHouseResponse
        List<BoardingHouseResponse> boardingHouseResponses = boardingHouses.stream().map(boardingHouseMapper::toBoardingHouseResponse).toList();
        boardingHouseResponses.forEach(boardingHouseResponse -> {
            boardingHouseResponse.setImageUrl(imageMap.get(boardingHouseResponse.getId()));
            boardingHouseResponse.setAddress(addressMap.get(boardingHouseResponse.getId()));
        });
        return boardingHouseResponses;
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

    public String uploadImage(MultipartFile image) {
        try {
            if (image == null || image.isEmpty()) {
                return null;
            }

            // Đảm bảo đường dẫn thư mục đúng định dạng
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            // Tạo tên file duy nhất
            String originalFileName = image.getOriginalFilename();
            String sanitizedFileName = originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");
            String fileName = UUID.randomUUID() + "_" + sanitizedFileName;

            // Lưu file vào thư mục
            File dest = new File(uploadDir + fileName);
            image.transferTo(dest);

            return "uploads/" + fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
