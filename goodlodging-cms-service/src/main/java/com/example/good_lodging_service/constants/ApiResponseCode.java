package com.example.good_lodging_service.constants;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ApiResponseCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    BAD_REQUEST(400, "Bad Request", HttpStatus.BAD_REQUEST),
    INTERNAL_SERVER_ERROR(500,"INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR),

    SUCCESS(1000,"SUCCESS",HttpStatus.OK),
    INVALID_KEY(1001, "Invalid Key", HttpStatus.BAD_REQUEST),
    ENTITY_NOT_FOUND(1002, "Entity not found", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1003, "Không tìm thấy người dùng", HttpStatus.BAD_REQUEST),
    USER_ALREADY_EXISTS(1004, "User already exists", HttpStatus.BAD_REQUEST),
    INVALID_USERNAME(1005, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1006, "Password invalid", HttpStatus.BAD_REQUEST),
    INCORRECT_PASSWORD(1007, "Incorrect Password", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND(1010, "Role not found", HttpStatus.BAD_REQUEST),
    ROLE_ALREADY_EXISTS(1011, "Role already exists", HttpStatus.BAD_REQUEST),
    PERMISSION_DENIED(1012, "Permission denied",HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_ALLOWED(1013, "Permission not allowed", HttpStatus.BAD_REQUEST),
    PERMISSION_ALREADY_EXISTS(1014, "Permission already exists", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_FOUND(1015, "Permission not found", HttpStatus.BAD_REQUEST),
    INVALID_DOB(1016, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    EMAIL_OR_PHONE_NUMBER_ALREADY_EXISTS(1001,"Email or Phone Number Already Exists",HttpStatus.BAD_REQUEST),

    //AUTH
    INVALID_CREDENTIALS(2001,"Tên đăng nhập hoặc mật khẩu không đúng",HttpStatus.BAD_REQUEST),
    PASSWORD_MISMATCH(2002,"Mật khẩu không chính xác",HttpStatus.BAD_REQUEST),
    ACCOUNT_LOCKED(2003,"Tài khoản đã bị khóa",HttpStatus.BAD_REQUEST),
    ACCOUNT_DISABLED(2004,"Tài khoản đã bị vô hiệu hóa",HttpStatus.BAD_REQUEST),
    ACCOUNT_EXPIRED(2005,"Tài khoản đã hết hạn",HttpStatus.BAD_REQUEST),
    PASSWORD_EXPIRED(2006,"Mật khẩu đã hết hạn, vui lòng đổi mật khẩu",HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(2007, "Unauthenticated",HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(2008, "You do not have permission", HttpStatus.FORBIDDEN),
    PASSWORD_CHANGED_SUCCESSFULLY(2009,"Mật khẩu đã được thay đổi thành công",HttpStatus.OK),
    USER_DELETED_SUCCESSFULLY(2010,"Người dùng đã được xóa thành công",HttpStatus.OK),
    INVALID_TOKEN(2011,"Invalid token",HttpStatus.BAD_REQUEST),

    //PASSWORD
    PASSWORD_INCORRECT(3001, "Mật khẩu hiện tại không đúng",HttpStatus.BAD_REQUEST),
    PASSWORD_SAME_AS_OLD(3002, "Mật khẩu mới không được trùng với mật khẩu cũ",HttpStatus.BAD_REQUEST),
    CURRENT_PASSWORD_INCORRECT(3003,"Mật khẩu hiện tại không đúng",HttpStatus.BAD_REQUEST),
    PASSWORD_CONFIRM_MISMATCH(3004,"Mật khẩu mới và mật khẩu xác nhận không giống nhau.",HttpStatus.BAD_REQUEST),

    ADDRESS_ALREADY_EXISTS(2021,"Address already exists",HttpStatus.BAD_REQUEST),
    ADDRESS_DELETED_SUCCESSFULLY(2022,"Address already deleted",HttpStatus.OK),

    //NOTIFICATION
    CANNOT_SEND_EMAIL(4001,"Không thể gửi email",HttpStatus.BAD_REQUEST),
    CANNOT_SEND_SMS(4002,"Không thể gửi tin nhắn SMS",HttpStatus.BAD_REQUEST),
    INVALID_OTP(4003,"Mã OTP không hợp lệ",HttpStatus.BAD_REQUEST),
    OTP_EXPIRED(4004,"Mã OTP đã hết hạn",HttpStatus.BAD_REQUEST),

    //EMAIL PHONE_NUMBER
    INVALID_REQUEST_EMAIL(5001,"Không được để trống email",HttpStatus.BAD_REQUEST),

    //BOARDING_HOUSE
    BOARDING_HOUSE_DELETED_SUCCESSFUL(6001, "Nhà trọ đã được xóa thành công", HttpStatus.OK),
    BOARDING_HOUSE_ALREADY_EXISTED(6002, "Nhà trọ đã tồn tại, vui lòng chọn tên khác", HttpStatus.BAD_REQUEST),
    CHANGE_BOARDING_HOUSE_OWNER_SUCCESSFUL(6003,"Nhà trọ đã được chuyển nhượng thành công", HttpStatus.OK),
    //ADDRESS
    ADDRESS_NOT_FOUND(7001, "Không tìm thấy địa chỉ", HttpStatus.BAD_REQUEST),

    //ROOM
    ROOM_ALREADY_EXITED(8001,"Phòng đã tồn tại, vui lòng chọn tên khác", HttpStatus.BAD_REQUEST),
    ROOM_DELETED_SUCCESSFUL(8002, "Phòng đã được xóa thành công", HttpStatus.OK),
    ROOM_NOT_FOUND(8003,"Không tìm thấy phòng", HttpStatus.BAD_REQUEST),

    //DEVICE
    DEVICE_ALREADY_EXITED(9001, "Thiết bị đã tồn tại", HttpStatus.BAD_REQUEST),
    DEVICE_DELETED_SUCCESSFUL(9002, "Thiết bị đã được xóa thành công", HttpStatus.OK),

    //POST
    POST_DELETED_SUCCESSFUL(1101,"Bài viết đã được xóa thành công", HttpStatus.OK),
    FIND_ROOM_MATE_SUCCESSFUL(1102,"Đăng bài tìm người ở ghép thành công",HttpStatus.OK),

    //FILTER

    INVALID_ROOM_RENT(1201,"Giá thuê phòng tối đa không được nhỏ hơn giá thuê phòng phòng tối thiểu",HttpStatus.BAD_REQUEST),
    INVALID_WATER_PRICE(1202,"Giá tiền nước tối đa không được nhỏ hơn giá tiền nước tối thiểu",HttpStatus.BAD_REQUEST),
    INVALID_ELECTRICITY_PRICE(1203,"Giá tiền điện tối đa không được nhỏ hơn giá tiền điện tối thiểu",HttpStatus.BAD_REQUEST),
    INVALID_AREA(1204,"Diện tích phòng tối đa không được nhỏ hơn diện tích phòng tối thiểu",HttpStatus.BAD_REQUEST),
    INVALID_ROOM_RENT_NEGATIVE(1205,"Diện tích phòng tìm kiếm không được nhỏ hơn 0",HttpStatus.BAD_REQUEST),
    INVALID_WATER_PRICE_NEGATIVE(1206,"Giá tiền nước tìm kiếm không được nhỏ hơn 0",HttpStatus.BAD_REQUEST),
    INVALID_ELECTRICITY_PRICE_NEGATIVE(1207,"Giá tiền điện tìm kiếm không được nhỏ hơn 0",HttpStatus.BAD_REQUEST),
    INVALID_AREA_NEGATIVE(1208,"Diện tích tìm kiếm không được nhỏ hơn 0",HttpStatus.BAD_REQUEST),

    //UPLOAD

    //FAVORITE POST
    ADD_FAVORITE_POST_SUCCESSFUL(1301,"Bài viết đã được thêm mới vào danh sách", HttpStatus.OK),
    DELETE_FAVORITE_POST_SUCCESSFUL(1032,"Bài viết đã được xóa khỏi danh sách yêu thích",HttpStatus.OK),
    FAVORITE_POST_ALREADY_EXISTED(1033,"Bài viết đã ở trong danh sách yêu thích", HttpStatus.OK),

    //ROOM_USER
    DELETE_ROOM_USER_SUCCESSFUL(1043,"Đã xóa người dùng khỏi phòng trọ", HttpStatus.OK),
    ;
    private final Integer code;
    private final String message;
    private final HttpStatusCode statusCode;
    ApiResponseCode(Integer code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
