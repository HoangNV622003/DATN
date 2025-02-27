package com.example.good_lodging_service.constants;

import io.micrometer.common.util.StringUtils;
import lombok.Getter;

@Getter
public enum CommonStatus {
    ACTIVE(1), INACTIVE(-1), NOT_ACTIVE(0), LOCK(-2), SUCCESS(200), DELETED(-3);

    final int value;

    CommonStatus(int value) {
        this.value = value;
    }

    public static CommonStatus find(String value) {
        if(StringUtils.isNotBlank(value)) {
            for (CommonStatus _clazz : CommonStatus.values()) {
                if (_clazz.name().equalsIgnoreCase(value)) {
                    return _clazz;
                }
            }
        }

        return null;
    }
}
