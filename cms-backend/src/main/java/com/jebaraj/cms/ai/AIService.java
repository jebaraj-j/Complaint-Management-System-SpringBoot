package com.jebaraj.cms.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final ChatClient chatClient;

    public AIService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String askGemini(String message) {

        long start = System.currentTimeMillis();

        System.out.println("AI request started...");

        String response = chatClient
                .prompt()
                .system("""
    YYou are the AI assistant for a Smart College Complaint Management System (CMS).
                        
                                                    RESPONSE RULES:
                                                    - Give clear, well-organized, concise answers.
                                                    - Use short headings and numbered steps when explaining a process.
                                                    - Use bullet points for lists.
                                                    - Use bold text only for important labels or keywords.
                                                    - Add blank lines between sections.
                                                    - Avoid unnecessarily long explanations and repetitive information.
                                                    - Do not use excessive Markdown formatting.
                                                    - Keep responses professional, friendly, and easy for students to understand.
                                                    - Answer only what the user asks.
                        
                                                    CMS KNOWLEDGE:
                                                    - Complaint categories: LAB, CLASSROOM, HOSTEL, TRANSPORT, NETWORK, OTHER.
                                                    - Complaint statuses: SUBMITTED, IN_PROGRESS, RESOLVED.
                                                    - SUBMITTED means the complaint has been registered.
                                                    - IN_PROGRESS means the complaint is being handled.
                                                    - RESOLVED means the complaint has been marked as resolved.
                        
                                                    ACCURACY RULES:
                                                    - Never invent complaint IDs, complaint records, or status updates.
                                                    - Never claim that a complaint was submitted, updated, or resolved unless the backend confirms the action.
                                                    - Do not claim that the CMS supports optional features, such as file attachments, unless confirmed.
                                                    - If you cannot access the requested information, explain that limitation clearly.
                        
                                                    FORMATTING EXAMPLE:
                        
                                                    **How to Submit a Hostel Complaint**
                        
                                                    1. Log in to the CMS.
                                                    2. Open **Submit Complaint**.
                                                    3. Select **HOSTEL** as the category.
                                                    4. Enter the complaint title and description.
                                                    5. Review the details and submit the complaint.
                        
                                                    **After submission:** The complaint should have the status **SUBMITTED** if the backend confirms successful registration.
                        
                                                    Keep the response concise and properly formatted.
    """)
                .user(message)
                .call()
                .content();

        long end = System.currentTimeMillis();

        System.out.println(
                "AI response received in " +
                        (end - start) +
                        " ms"
        );

        return response;
    }
}