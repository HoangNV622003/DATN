package com.example.good_lodging_service.controller;

import com.example.good_lodging_service.dto.request.chat.ChatRequest;
import com.example.good_lodging_service.dto.response.chat.ChatResponse;
import com.example.good_lodging_service.service.ChatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ChatController {
    ChatService chatService;
    @PostMapping
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody ChatRequest request) {
        return ResponseEntity.ok(chatService.processMessage(request));
    }
}
