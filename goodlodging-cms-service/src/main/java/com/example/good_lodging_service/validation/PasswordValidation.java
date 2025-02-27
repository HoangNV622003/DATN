package com.example.good_lodging_service.validation;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class PasswordValidation {

    public PasswordValidation() {
        // empty constructor
    }

    private static final String specialChars = "@#$%^`<>&+=\"!ºª·#~%&'¿¡€,:;*/+-.=_\\{\\}\\[\\]\\(\\)\\|\\_\\?\\\\";
    private static final String pattern = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d" + specialChars + "]{8,}$";
    private static final Pattern passwordPattern = Pattern.compile(pattern);

    public static boolean isPasswordValid(String password) {
        /**
         * Tối thiểu 8 ký tự số và chữ (có thể có ký tự đặc biệt)
         */
        Matcher m = passwordPattern.matcher(password);
        return m.matches();
    }
}
