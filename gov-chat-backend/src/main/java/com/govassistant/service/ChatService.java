package com.govassistant.service;

import com.govassistant.config.JwtUtil;
import com.govassistant.dto.ChatRequest;
import com.govassistant.dto.ChatResponse;
import com.govassistant.entity.ChatMessage;
import com.govassistant.entity.ChatSession;
import com.govassistant.entity.User;
import com.govassistant.repository.ChatMessageRepository;
import com.govassistant.repository.ChatSessionRepository;
import com.govassistant.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final UserRepository userRepo;
    private final ChatSessionRepository sessionRepo;
    private final ChatMessageRepository messageRepo;
    private final JwtUtil jwtUtil;
    private final PythonAIService pythonAIService;

    // Helper to get user from JWT
    private User getUserFromToken(String token) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<ChatSession> getUserSessions(String token) {
        User user = getUserFromToken(token);
        return sessionRepo.findByUserOrderByCreatedAtDesc(user); // Fetch history
    }

    public ChatSession createNewSession(String token) {
        User user = getUserFromToken(token);
        ChatSession newSession = new ChatSession();
        newSession.setUser(user);
        newSession.setTitle("New Consultation"); // Default title
        return sessionRepo.save(newSession);
    }

    public ChatResponse processChat(ChatRequest req, String token) {
        User user = getUserFromToken(token);

        // Find or create current session
        ChatSession session = sessionRepo
                .findTopByUserOrderByCreatedAtDesc(user)
                .orElseGet(() -> createNewSession(token));

        // Save User Message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setRole("user");
        userMsg.setMessage(req.getMessage());
        userMsg.setLanguage(req.getLanguage());
        userMsg.setSession(session);
        messageRepo.save(userMsg);

        // Update session title based on the first message if it's "New Consultation"
        if ("New Consultation".equals(session.getTitle())) {
            session.setTitle(req.getMessage().substring(0, Math.min(req.getMessage().length(), 30)) + "...");
            sessionRepo.save(session);
        }

        // Get AI Response
        String aiReply = pythonAIService.askAI(req);

        // Save Bot Message
        ChatMessage botMsg = new ChatMessage();
        botMsg.setRole("assistant");
        botMsg.setMessage(aiReply);
        botMsg.setLanguage(req.getLanguage());
        botMsg.setSession(session);
        messageRepo.save(botMsg);

        return new ChatResponse(aiReply);
    }

    public List<ChatMessage> getSessionMessages(Long sessionId) {
        ChatSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        return messageRepo.findBySession(session);
    }

    public void renameSession(Long sessionId, String newTitle) {
        ChatSession session = sessionRepo.findById(sessionId).get();
        session.setTitle(newTitle);
        sessionRepo.save(session);
    }

    public void deleteSession(Long sessionId) {
        sessionRepo.deleteById(sessionId);
    }
}