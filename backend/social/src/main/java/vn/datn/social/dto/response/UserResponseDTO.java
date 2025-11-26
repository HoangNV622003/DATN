package vn.datn.social.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private String username;
    private String email;
    private boolean isFriend;
    private boolean isFriendPending;
    private String image;
    private boolean friendRequestReceiver;
}
