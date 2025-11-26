package vn.datn.social.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.ChangePasswordRequest;
import vn.datn.social.dto.request.Edit_pf_Request;
import vn.datn.social.dto.response.UserDto;
import vn.datn.social.dto.response.UserManageDto;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.UserRepository;

import javax.swing.text.html.parser.Entity;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository repo;


    PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        List<User> users = (List<User>) repo.findAll();
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserManageDto convertToUserManageDTO(User user) {
        return new UserManageDto(
                user.getId(),
                user.getUsername(),
                user.getVerificationCode(),
                user.isEnabled(),
                user.getEmail(),
                user.isAdmin()
        );
    }

    public boolean emailExists(String email) {
        return repo.existsByEmail(email);
    }

    public boolean usernameExists(String username) {
        return repo.findByUsername(username).isPresent(); // Cập nhật
    }

    public User findById(long id) {
        return repo.findById(id).orElse(null);

    }

    public User addUser(User user) {
        return repo.save(user);
    }


    public User findByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User findByUsername(String username) {
        // Xử lý Optional<User> bằng orElseThrow() để ném ngoại lệ nếu không tìm thấy
        return repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }


    public void deleteById(long id) {
        repo.deleteById(id);
    }

    public User get(long id) {
        return repo.findById(id)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy người dùng"));

    }

    public boolean verify(String verificationCode) {
        User user = repo.findByVerificationCode(verificationCode)
                .orElseThrow(()-> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND));

        if (user == null || user.isEnabled()) {
            return false;
        } else {
            user.setEnabled(true);
            user.setVerificationCode(null);
            repo.save(user);
            return true;
        }
    }

    public void save(User user) {
        // Kiểm tra username đã tồn tại
        if (repo.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username đã tồn tại!");
        }

        // Kiểm tra email đã tồn tại
        if (repo.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại!");
        }

        repo.save(user);
    }

    public void saveAgaint(User user) {
        repo.save(user);
    }

    // Cập nhật thông tin người dùng
    public User updateUserProfile(Edit_pf_Request userProfileRequest) {
        // Lấy thông tin người dùng từ security context
        User currentUser = findByUsername(userProfileRequest.username());

        // Cập nhật email và địa chỉ nếu có
        if (userProfileRequest.email() != null && !userProfileRequest.email().isEmpty()) {
            currentUser.setEmail(userProfileRequest.email());
        }

        if (userProfileRequest.address() != null && !userProfileRequest.address().isEmpty()) {
            currentUser.setAddress(userProfileRequest.address());
        }

        // Cập nhật mật khẩu nếu có và mã hóa mật khẩu trước khi lưu
        if (userProfileRequest.password() != null && !userProfileRequest.password().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(userProfileRequest.password());
            currentUser.setPassword(encodedPassword);
        }

        // Lưu người dùng đã cập nhật
        return repo.save(currentUser);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());

        // Convert BLOB to Base64 string
        if (user.getImage() != null) {
            try {
                Blob imageBlob = user.getImage();
                byte[] imageBytes = imageBlob.getBytes(1, (int) imageBlob.length());
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                dto.setImage("data:image/jpeg;base64," + base64Image); // Ensure the correct prefix
                System.out.println("Successfully converted image to Base64 for user: " + user.getUsername());
            } catch (SQLException e) {
                System.err.println("Error retrieving image for user: " + user.getUsername());
            }
        } else {
            dto.setImage(null); // Handle null image case
            System.out.println("No image found for user: " + user.getUsername());
        }

        return dto;
    }


    public String getUsernameById(long id) {
        return repo.findById(id).get().getUsername();
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = repo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Kiểm tra khớp mật khẩu mới và xác nhận
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }

        // Mã hóa và cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        repo.save(user);
    }
}


