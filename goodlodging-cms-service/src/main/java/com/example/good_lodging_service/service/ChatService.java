package com.example.good_lodging_service.service;

import com.example.good_lodging_service.dto.request.chat.ChatRequest;
import com.example.good_lodging_service.dto.response.chat.ChatResponse;
import com.example.good_lodging_service.repository.ChatMessageRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class ChatService {
    ChatMessageRepository chatMessageRepository;
    public ChatResponse processMessage(ChatRequest chatRequest) {
        ChatResponse chatResponse = new ChatResponse();
        return chatResponse;
    }
}
