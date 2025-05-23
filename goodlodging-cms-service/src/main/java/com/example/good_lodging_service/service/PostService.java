package com.example.good_lodging_service.service;

import com.example.good_lodging_service.constants.ApiResponseCode;
import com.example.good_lodging_service.constants.CommonStatus;
import com.example.good_lodging_service.constants.EntityType;
import com.example.good_lodging_service.constants.PostType;
import com.example.good_lodging_service.dto.request.Post.FindRoomMateRequest;
import com.example.good_lodging_service.dto.request.Post.PostFilterRequest;
import com.example.good_lodging_service.dto.request.Post.PostRequest;
import com.example.good_lodging_service.dto.response.Address.AddressProjection;
import com.example.good_lodging_service.dto.response.AuthorInfo.AuthorInfo;
import com.example.good_lodging_service.dto.response.BoardingHouse.BoardingHouseResponse;
import com.example.good_lodging_service.dto.response.CommonResponse;
import com.example.good_lodging_service.dto.response.Post.*;
import com.example.good_lodging_service.dto.response.Profile.ProfileResponse;
import com.example.good_lodging_service.dto.response.Room.RoomResponse;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    BoardingHouseRepository boardingHouseRepository;
    BoardingHouseMapper boardingHouseMapper;
    PostMapper postMapper;
    UserRepository userRepository;
    RoomRepository roomRepository;
    ImageRepository imageRepository;
    UserMapper userMapper;
    AddressRepository addressRepository;
    RoomMapper roomMapper;
    @Value("${upload.uploadDir}")
    @NonFinal
    private String uploadDir;
    Integer MAX_POST_SUGGESTED=15;
    public PostResponse createPost(PostRequest request) throws Exception {
        //get address by boardingHouseId
        Address address = addressRepository.findByBoardingHouseIdAndStatusWithQuery(request.getBoardingHouseId(), CommonStatus.ACTIVE.getValue()).orElse(null);
        Post post = postMapper.toPost(request);
        post.setStatus(CommonStatus.ACTIVE.getValue());
        post.setAddress(address != null ? address.getFullAddress() : "");
        post.setImageUrl(uploadImage(request.getImageUrl()));
        post.setType(PostType.NORMAL.getValue());
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
        Image image=imageRepository.findByEntityIdAndEntityTypeAndStatus(user.getId(),EntityType.USER.getValue(), CommonStatus.ACTIVE.getValue()).orElse(null);
        UserResponseDTO userResponseDTO = userMapper.toUserResponse(user);
        userResponseDTO.setImageUrl(image!=null?ValueUtils.getOrDefault(image.getImageUrl(),""):"");
        return AuthorInfo.builder()
                .authorInfo(userResponseDTO)
                .posts(getAllMyPosts(id, pageable))
                .build();
    }

    public PostDetailResponse getPostDetailById(Long id) {
        PostDetailProjection postDetailProjection = postRepository.findByPostIdAndStatusWithQuery(id, CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        log.info("boardingHouseId:{}", postDetailProjection.getBoardingHouseId());
        List<Image> boardingHouseImageUrls = imageRepository.findAllByEntityIdAndEntityTypeAndStatus(postDetailProjection.getBoardingHouseId(), EntityType.BOARDING_HOUSE.getValue(), CommonStatus.ACTIVE.getValue());
        List<Image> roomImageUrls = imageRepository.findAllByEntityIdAndEntityTypeAndStatus(postDetailProjection.getRoomId(), EntityType.ROOM.getValue(), CommonStatus.ACTIVE.getValue());
        boardingHouseImageUrls.addAll(roomImageUrls);
        List<String> imageUrls = new ArrayList<>(List.of(postDetailProjection.getImageUrl()));
        imageUrls.addAll(boardingHouseImageUrls.stream().map(Image::getImageUrl).toList());
        List<RoomResponse> rooms=roomRepository.findAllByBoardingHouseIdAndStatusWithQuery(postDetailProjection.getBoardingHouseId(),CommonStatus.ACTIVE.getValue())
                .stream().map(roomMapper::toRoomResponseDTO).toList();
        Image image=imageRepository.findAllByEntityIdAndEntityTypeAndStatus(postDetailProjection.getUserId(),EntityType.USER.getValue(), CommonStatus.ACTIVE.getValue()).getFirst();

        return PostDetailResponse.builder()
                .authorInfo(ProfileResponse.fromPostDetailProjection(postDetailProjection,image.getImageUrl()))
                .title(ValueUtils.getOrDefault(postDetailProjection.getTitle(), ""))
                .maxArea(ValueUtils.getOrDefault(postDetailProjection.getMaxArea(), 0F))
                .minArea(ValueUtils.getOrDefault(postDetailProjection.getMinArea(), 0F))
                .maxRent(ValueUtils.getOrDefault(postDetailProjection.getMaxRent(), 0F))
                .minRent(ValueUtils.getOrDefault(postDetailProjection.getMinRent(), 0F))
                .electricityPrice(ValueUtils.getOrDefault(postDetailProjection.getElectricityPrice(), 0F))
                .waterPrice(ValueUtils.getOrDefault(postDetailProjection.getWaterPrice(), 0F))
                .otherPrice(ValueUtils.getOrDefault(postDetailProjection.getOtherPrice(), 0F))
                .description(ValueUtils.getOrDefault(postDetailProjection.getDescription(), ""))
                .address(ValueUtils.getOrDefault(postDetailProjection.getAddress(), ""))
                .type(postDetailProjection.getType())
                .imageUrl(imageUrls)
                .emptyRooms(rooms)
                .build();

    }

    public CommonResponse findRoomMate(FindRoomMateRequest request) {
        BoardingHouse boardingHouse = boardingHouseRepository.findByIdAndStatus(request.getBoardingHouseId(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ENTITY_NOT_FOUND));
        Address address = addressRepository.findByIdAndStatus(boardingHouse.getAddressId(), CommonStatus.ACTIVE.getValue()).orElse(null);
        Room room = roomRepository.findByIdAndStatus(request.getRoomId(), CommonStatus.ACTIVE.getValue()).orElseThrow(
                () -> new AppException(ApiResponseCode.ROOM_NOT_FOUND));
        Post post = Post.builder()
                .boardingHouseId(boardingHouse.getId())
                .address(address != null ? address.getFullAddress() : "")
                .title(request.getTitle())
                .userId(request.getUserId())
                .roomId(request.getRoomId())
                .type(PostType.FIND_ROOM_MATE.getValue())
                .electricityPrice(boardingHouse.getElectricityPrice())
                .waterPrice(boardingHouse.getWaterPrice())
                .otherPrice(boardingHouse.getOtherPrice())
                .status(CommonStatus.ACTIVE.getValue())
                .maxRent(room.getPrice())
                .minRent(room.getPrice())
                .maxArea(room.getArea())
                .minArea(room.getArea())
                .imageUrl(uploadImage(request.getImageFile()))
                .build();

        postRepository.save(post);
        return CommonResponse.builder().status(200).result(ApiResponseCode.FIND_ROOM_MATE_SUCCESSFUL.getMessage()).build();
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

        return MyPostResponse.builder()
                .postResponse(postMapper.toPostResponse(post))
                .boardingHouses(convertToBoardingHouseResponse(boardingHouses, images, addresses))
                .build();
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

    public List<PostProjection> getSuggestedPosts(String provinceName, String districtName, String wardName) {
        List<PostProjection> result = new ArrayList<>();

        // Ward-level query
        if (wardName != null && !wardName.isEmpty()) {
            List<PostProjection> wardPosts = postRepository.findByWard(provinceName, districtName, wardName, CommonStatus.ACTIVE.getValue());
            result.addAll(wardPosts);
        }

        // District-level query
        if (result.size() < MAX_POST_SUGGESTED && districtName != null && !districtName.isEmpty()) {
            List<PostProjection> districtPosts = postRepository.findByDistrict(provinceName, districtName, wardName, CommonStatus.ACTIVE.getValue(), MAX_POST_SUGGESTED - result.size());
            result.addAll(districtPosts);
        }

        // Province-level query
        if (result.size() < MAX_POST_SUGGESTED && provinceName != null && !provinceName.isEmpty()) {
            List<PostProjection> provincePosts = postRepository.findByProvince(provinceName, districtName, wardName, CommonStatus.ACTIVE.getValue(), MAX_POST_SUGGESTED - result.size());
            result.addAll(provincePosts);
        }

        return result;
    }
    private Page<PostProjection> findByAddressAndFeature(PostFilterRequest filter, Pageable pageable) {
        validateFilter(filter);
        return postRepository.findAllByAddressAndFeaturesWithQuery(
                filter.getWardsId(),
                filter.getMinRent(),
                filter.getMaxRent(),
                filter.getMinArea(),
                filter.getMaxArea(),
                filter.getMinElectricityPrice(),
                filter.getMaxElectricityPrice(),
                filter.getMinWaterPrice(),
                filter.getMaxWaterPrice(),
                filter.getFeatures(),
                filter.getDescription(),
                filter.getRoomType(),
                pageable
        );
    }

    private void validateFilter(PostFilterRequest filter) {
        // Kiểm tra minRoomRent và maxRoomRent
        if (filter.getMinRent() != null && filter.getMaxRent() != null) {
            if (filter.getMinRent() > filter.getMaxRent()) {
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
        if (filter.getMinRent() != null && filter.getMinRent() < 0) {
            throw new AppException(ApiResponseCode.INVALID_ROOM_RENT_NEGATIVE);
        }
        if (filter.getMaxRent() != null && filter.getMaxRent() < 0) {
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
