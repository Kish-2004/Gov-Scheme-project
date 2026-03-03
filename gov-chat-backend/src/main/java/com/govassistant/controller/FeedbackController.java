package com.govassistant.controller;


import com.govassistant.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/{messageId}")
    public ResponseEntity<?> submitFeedback(
            @PathVariable Long messageId,
            @RequestParam boolean helpful,
            @RequestHeader("Authorization") String token) {

        feedbackService.submitFeedback(messageId, helpful, token);
        return ResponseEntity.ok("Feedback recorded");
    }
}
