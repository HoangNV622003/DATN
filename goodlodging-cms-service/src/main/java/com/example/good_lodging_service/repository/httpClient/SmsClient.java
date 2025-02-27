package com.example.good_lodging_service.repository.httpClient;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "sms-client")
public interface SmsClient {
}
