package com.govassistant.repository;
import com.govassistant.entity.ChatSession;
import com.govassistant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    Optional<ChatSession> findTopByUserOrderByCreatedAtDesc(User user);
    List<ChatSession> findByUserOrderByCreatedAtDesc(User user);

}
