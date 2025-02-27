package com.example.good_lodging_service.utils;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class DateTimeUtils {

    // Định dạng mặc định: "yyyy-MM-dd HH:mm:ss"
    private static final DateTimeFormatter DEFAULT_FORMATTER = DateTimeFormatter
            .ofPattern("yyyy-MM-dd HH:mm:ss")
            .withZone(ZoneId.systemDefault());

    // Định dạng tùy chỉnh khác nếu cần (ví dụ: "dd/MM/yyyy HH:mm")
    private static final DateTimeFormatter SHORT_FORMATTER = DateTimeFormatter
            .ofPattern("dd/MM/yyyy HH:mm")
            .withZone(ZoneId.systemDefault());

    // Phương thức tĩnh để định dạng thời gian với formatter mặc định
    public static String format(Instant instant) {
        if (instant == null) {
            throw new IllegalArgumentException("Instant cannot be null");
        }
        return DEFAULT_FORMATTER.format(instant);
    }

    // Phương thức tĩnh để định dạng thời gian với múi giờ cụ thể
    public static String format(Instant instant, ZoneId zoneId) {
        if (instant == null || zoneId == null) {
            throw new IllegalArgumentException("Instant and ZoneId cannot be null");
        }
        return DEFAULT_FORMATTER.withZone(zoneId).format(instant);
    }

    // Phương thức tĩnh để định dạng thời gian với định dạng ngắn
    public static String formatShort(Instant instant) {
        if (instant == null) {
            throw new IllegalArgumentException("Instant cannot be null");
        }
        return SHORT_FORMATTER.format(instant);
    }

    // Phương thức tĩnh để định dạng thời gian với định dạng tùy chỉnh
    public static String formatCustom(Instant instant, String pattern, ZoneId zoneId) {
        if (instant == null || pattern == null || zoneId == null) {
            throw new IllegalArgumentException("Instant, pattern, and ZoneId cannot be null");
        }
        DateTimeFormatter customFormatter = DateTimeFormatter
                .ofPattern(pattern)
                .withZone(zoneId);
        return customFormatter.format(instant);
    }
}