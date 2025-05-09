package com.example.good_lodging_service.service;

import com.example.good_lodging_service.dto.request.chat.ChatRequest;
import com.example.good_lodging_service.dto.response.chat.ChatResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatService {

    RestTemplate restTemplate = new RestTemplate();
    ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.url}")
    @NonFinal
    String geminiApiUrl;

    @Value("${gemini.api.key}")
    @NonFinal
    String geminiApiKey;

    public ChatResponse processMessage(ChatRequest chatRequest) {
        try {
            // Tạo URL với API key
            String url = geminiApiUrl + "?key=" + geminiApiKey;

            // Tạo payload cho Gemini API
            String payload = String.format(
                    "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}",
                    chatRequest.getMessage().replace("\"", "\\\"")
            );

            // Thiết lập headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Tạo request entity
            HttpEntity<String> requestEntity = new HttpEntity<>(payload, headers);

            // Gửi yêu cầu POST tới Gemini API
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            // Xử lý phản hồi
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                String content = jsonResponse
                        .path("candidates")
                        .path(0)
                        .path("content")
                        .path("parts")
                        .path(0)
                        .path("text")
                        .asText();
                return ChatResponse.builder().content(content).build();
            } else {
                throw new RuntimeException("Failed to get valid response from Gemini API");
            }

        } catch (Exception e) {
            throw new RuntimeException("Error processing Gemini API request: " + e.getMessage(), e);
        }
    }
}