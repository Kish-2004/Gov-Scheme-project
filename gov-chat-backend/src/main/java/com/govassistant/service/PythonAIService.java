package com.govassistant.service;

import com.govassistant.dto.ChatRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class PythonAIService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String askAI(ChatRequest req) {

        ResponseEntity<Map> res =
                restTemplate.postForEntity(
                        "http://localhost:5000/chatbot",
                        req,
                        Map.class
                );

        return res.getBody().get("reply").toString();
    }
}
