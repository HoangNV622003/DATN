package com.example.good_lodging_service.constants;

import lombok.Getter;

@Getter
public enum CountryCode {
    VIETNAM("+84", "Vietnam"),
    USA("+1", "United States"),
    UK("+44", "United Kingdom"),
    JAPAN("+81", "Japan"),
    INDIA("+91", "India");

    private final String code;
    private final String countryName;

    CountryCode(String code, String countryName) {
        this.code = code;
        this.countryName = countryName;
    }

    public static CountryCode fromCode(String code) {
        for (CountryCode country : CountryCode.values()) {
            if (country.getCode().equals(code)) {
                return country;
            }
        }
        throw new IllegalArgumentException("Invalid country code: " + code);
    }
}