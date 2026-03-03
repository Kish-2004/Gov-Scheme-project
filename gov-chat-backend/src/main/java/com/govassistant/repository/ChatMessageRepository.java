package com.govassistant.repository;
import com.govassistant.entity.ChatMessage;
import com.govassistant.entity.ChatSession;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySession(ChatSession session);
}
