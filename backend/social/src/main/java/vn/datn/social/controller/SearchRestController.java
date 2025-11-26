package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.datn.social.dto.response.SearchDTO;
import vn.datn.social.entity.User;
import vn.datn.social.service.FriendService;
import vn.datn.social.service.SearchService;
import vn.datn.social.service.UserService;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SearchRestController {

    SearchService searchService;
    FriendService friendService;
    UserService userService;

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(value = "keyword", required = false) String keyword,
                                    @RequestParam(value = "page", defaultValue = "0") int page,
                                    @RequestParam(value = "size", defaultValue = "7") int size,
                                    Principal principal) {
        String currentUsername = principal.getName();
        User currentUser = userService.findByUsername(currentUsername);

        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = searchService.listAll(keyword, pageable, currentUser);

        // Map User to UserDto and check friendship statuses
        List<SearchDTO> userDtos = usersPage.getContent().stream().map(user -> {
            boolean friend = friendService.isFriendAccepted(currentUser, user);
            boolean friendPending = friendService.isFriendPending(currentUser, user);
            boolean friendRequestReceiver = friendService.isCurrentUserFriendRequestReceiver(user, currentUser);

            return new SearchDTO(user.getUsername(), user.getEmail(), friend, friendPending, friendRequestReceiver, user.isEnabled(), user.isAdmin());
        }).collect(Collectors.toList());

        return ResponseEntity.ok(userDtos);
    }
}
