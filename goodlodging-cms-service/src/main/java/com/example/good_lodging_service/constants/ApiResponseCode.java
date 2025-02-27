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
    USER_NOT_FOUND(1003, "User not found", HttpStatus.BAD_REQUEST),
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
    INVALID_REQUEST_EMAIL(5001,"Không được để trống email",HttpStatus.BAD_REQUEST)
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
