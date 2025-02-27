package com.example.good_lodging_service.utils;

import com.example.good_lodging_service.constants.CountryCode;

public class PhoneNumberUtils {
    public static String normalizePhoneNumber(String phoneNumber, CountryCode defaultCountryCode) {
        // Loại bỏ khoảng trắng, dấu gạch ngang, dấu ngoặc
        String cleanedNumber = phoneNumber.replaceAll("[^0-9+]", "");

        if (cleanedNumber.startsWith("+")) {
            if (!cleanedNumber.matches("\\+\\d{9,15}")) {
                throw new IllegalArgumentException("Invalid phone number format: " + phoneNumber);
            }
            return cleanedNumber;
        }

        if (cleanedNumber.startsWith("0")) {
            return defaultCountryCode.getCode() + cleanedNumber.substring(1);
        } else {
            return defaultCountryCode.getCode() + cleanedNumber;
        }
    }
}
