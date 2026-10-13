package com.jebaraj.cms.ai;

import com.jebaraj.cms.ai.dto.ChatRequest;
import com.jebaraj.cms.ai.dto.ChatResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/test")
    public String testGemini(@RequestParam String message) {
        return aiService.askGemini(message);
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {

        String response = aiService.askGemini(request.message());

        return new ChatResponse(response);
    }
}