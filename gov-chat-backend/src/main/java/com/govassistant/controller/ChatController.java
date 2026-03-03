package com.govassistant.controller;

import com.govassistant.dto.ChatRequest;
import com.govassistant.dto.ChatResponse;
import com.govassistant.entity.ChatMessage;
import com.govassistant.entity.ChatSession;
import com.govassistant.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Existing chat endpoint
    @PostMapping
    public ChatResponse chat(
            @RequestBody ChatRequest request,
            @RequestHeader("Authorization") String token) {
        return chatService.processChat(request, token);
    }

    // NEW: Fetch all history for the sidebar
    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSession>> getSessions(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(chatService.getUserSessions(token));
    }

    // NEW: Explicitly start a new session
    @PostMapping("/new-session")
    public ResponseEntity<ChatSession> startNewSession(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(chatService.createNewSession(token));
    }

    // 1. Fetch messages for a specific session
    @GetMapping("/session/{sessionId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long sessionId) {
        return ResponseEntity.ok(chatService.getSessionMessages(sessionId));
    }

    // 2. Rename session
    @PutMapping("/session/{sessionId}")
    public ResponseEntity<Void> renameSession(@PathVariable Long sessionId, @RequestBody String newTitle) {
        chatService.renameSession(sessionId, newTitle);
        return ResponseEntity.ok().build();
    }

    // 3. Delete session
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long sessionId) {
        chatService.deleteSession(sessionId);
        return ResponseEntity.ok().build();
    }
}