package com.govassistant.service;

import com.govassistant.config.JwtUtil;
import com.govassistant.entity.*;
import com.govassistant.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepo;
    private final ChatMessageRepository messageRepo;
    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;

    public void submitFeedback(Long messageId, boolean helpful, String token) {

        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatMessage message = messageRepo.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        Feedback feedback = new Feedback();
        feedback.setHelpful(helpful);
        feedback.setChatMessage(message);
        feedback.setUser(user);

        feedbackRepo.save(feedback);
    }
}
