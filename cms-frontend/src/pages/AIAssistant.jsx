import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

import AppShell from "../components/layout/AppShell";

/* ── icon primitive ───────────────────────────────────────── */

function Icon({ d, children, size = 18 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {d ? <path d={d} /> : children}
        </svg>
    );
}


/* ── icons ────────────────────────────────────────────────── */

const IC = {
    send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",

    clear: (
        <>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </>
    ),

    bot: (
        <>
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M12 11V7" />
            <circle cx="12" cy="5" r="2" />
            <path d="M8 15h.01M16 15h.01" />
        </>
    ),

    spark: (
        <>
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
        </>
    ),

    user: (
        <path d="M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    ),
};


/* ── suggested questions ─────────────────────────────────── */

const SUGGESTIONS = [
    "What is the status of my latest complaint?",
    "How many complaints have I submitted?",
    "Show my unresolved complaints",
    "How do I submit a new complaint?",
    "What does In Progress mean?",
    "How long does it take to resolve a complaint?",
];


/* ── message id ───────────────────────────────────────────── */

let msgIdCounter = 0;

function makeId() {
    return ++msgIdCounter;
}


/* ── format message time ─────────────────────────────────── */

function formatTime(date) {
    return date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });
}


/* ── AI Assistant ─────────────────────────────────────────── */

export default function AIAssistant() {

    const navigate = useNavigate();

    const student = JSON.parse(localStorage.getItem("student"));

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);

    const bottomRef = useRef(null);
    const inputRef = useRef(null);


    /* ── logout ───────────────────────────────────────────── */

    const handleLogout = () => {
        localStorage.removeItem("student");
        navigate("/");
    };


    /* ── scroll to bottom whenever messages change ───────── */

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, typing]);


    /* ── send message ────────────────────────────────────── */

    const sendMessage = useCallback(async (text) => {

        const trimmed = text.trim();

        if (!trimmed || typing) {
            return;
        }


        /* Add user message immediately */

        const userMsg = {
            id: makeId(),
            role: "user",
            content: trimmed,
            ts: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);

        setInput("");
        setTyping(true);


        try {

            /* Send message to Spring Boot AI API */

            const response = await axios.post(
                "http://localhost:8080/api/ai/chat",
                {
                    message: trimmed,
                }
            );


            /* Get Gemini response */

            const assistantMsg = {
                id: makeId(),
                role: "assistant",
                content: response.data.response,
                ts: new Date(),
            };


            /* Add AI response to chat */

            setMessages((prev) => [
                ...prev,
                assistantMsg,
            ]);

        } catch (error) {

            console.error("AI chat error:", error);
            console.error("Error message:", error.message);
            console.error("Error response:", error.response);
            console.error("Error request:", error.request);


            /* Show friendly error message */

            const assistantMsg = {
                id: makeId(),
                role: "assistant",
                content:
                    "Sorry, I couldn't connect to the AI Assistant right now. Please try again.",
                ts: new Date(),
            };


            setMessages((prev) => [
                ...prev,
                assistantMsg,
            ]);

        } finally {

            setTyping(false);
        }

    }, [typing]);


    /* ── keyboard handling ───────────────────────────────── */

    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            sendMessage(input);
        }
    };


    /* ── clear chat ───────────────────────────────────────── */

    const clearChat = () => {

        setMessages([]);

        setTyping(false);

        inputRef.current?.focus();
    };


    /* ── topbar ───────────────────────────────────────────── */

    const topbar = (
        <div className="topbar-inner">

            <span className="topbar-greeting">
                Hello, <strong>{student?.name}</strong>
            </span>

            <button
                className="btn-topbar-logout"
                onClick={handleLogout}
            >
                Sign out
            </button>

        </div>
    );


    /* ── empty state ──────────────────────────────────────── */

    const isEmpty =
        messages.length === 0 && !typing;


    /* ── page ─────────────────────────────────────────────── */

    return (
        <AppShell
            role="student"
            onLogout={handleLogout}
            topbar={topbar}
        >

            <div className="ai-page">


                {/* Page header */}

                <header className="ai-page-header">

                    <div className="ai-page-header-text">

                        <h1>AI Assistant</h1>

                        <p>
                            Ask about your complaints, complaint status,
                            or how to use CCMS.
                        </p>

                    </div>


                    {!isEmpty && (

                        <button
                            className="ai-clear-btn"
                            onClick={clearChat}
                            aria-label="Clear chat history"
                        >

                            <Icon size={15}>
                                {IC.clear}
                            </Icon>

                            Clear chat

                        </button>

                    )}

                </header>


                {/* Chat workspace */}

                <div className="ai-workspace">


                    {/* Messages area */}

                    <div
                        className="ai-messages"
                        aria-live="polite"
                        aria-label="Chat messages"
                    >


                        {/* Empty state */}

                        {isEmpty && (

                            <div className="ai-empty">

                                <div
                                    className="ai-avatar ai-avatar--lg"
                                    aria-hidden="true"
                                >

                                    <Icon size={32}>
                                        {IC.bot}
                                    </Icon>

                                </div>


                                <h2>
                                    How can I help you?
                                </h2>


                                <p>
                                    Ask about your complaints,
                                    complaint status, or how to
                                    navigate the CCMS platform.
                                </p>


                                <p className="ai-empty-note">
                                    Powered by Spring AI and Google Gemini.
                                </p>


                                {/* Suggested questions */}

                                <div
                                    className="ai-suggestions"
                                    aria-label="Suggested questions"
                                >

                                    {SUGGESTIONS.map((q, i) => (

                                        <button
                                            key={i}
                                            className="ai-suggestion-chip"
                                            onClick={() => setInput(q)}
                                            aria-label={`Use suggestion: ${q}`}
                                        >

                                            <Icon size={13}>
                                                {IC.spark}
                                            </Icon>

                                            {q}

                                        </button>

                                    ))}

                                </div>

                            </div>

                        )}


                        {/* Message list */}

                        {messages.map((msg) => (

                            <div
                                key={msg.id}
                                className={`ai-msg ai-msg--${msg.role}`}
                                aria-label={
                                    msg.role === "user"
                                        ? "Your message"
                                        : "Assistant message"
                                }
                            >


                                {/* Assistant avatar */}

                                {msg.role === "assistant" && (

                                    <div
                                        className="ai-avatar ai-avatar--sm"
                                        aria-hidden="true"
                                    >

                                        <Icon size={16}>
                                            {IC.bot}
                                        </Icon>

                                    </div>

                                )}


                                {/* Message body */}

                                <div className="ai-msg-body">

                                    <div className="ai-msg-bubble">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>

                                    <span className="ai-msg-time">
                                        {formatTime(msg.ts)}
                                    </span>

                                </div>


                                {/* User avatar */}

                                {msg.role === "user" && (

                                    <div
                                        className="ai-avatar ai-avatar--sm ai-avatar--user"
                                        aria-hidden="true"
                                    >

                                        <Icon size={16}>
                                            {IC.user}
                                        </Icon>

                                    </div>

                                )}

                            </div>

                        ))}


                        {/* Typing indicator */}

                        {typing && (

                            <div
                                className="ai-msg ai-msg--assistant"
                                aria-label="Assistant is typing"
                            >

                                <div
                                    className="ai-avatar ai-avatar--sm"
                                    aria-hidden="true"
                                >

                                    <Icon size={16}>
                                        {IC.bot}
                                    </Icon>

                                </div>


                                <div className="ai-msg-body">

                                    <div
                                        className="ai-msg-bubble ai-typing-bubble"
                                        aria-hidden="true"
                                    >

                                        <span className="ai-dot" />
                                        <span className="ai-dot" />
                                        <span className="ai-dot" />

                                    </div>

                                </div>

                            </div>

                        )}


                        <div ref={bottomRef} />

                    </div>


                    {/* Input bar */}

                    <div className="ai-input-bar">

                        <label
                            htmlFor="ai-input"
                            className="sr-only"
                        >
                            Message AI Assistant
                        </label>


                        <textarea
                            id="ai-input"
                            ref={inputRef}
                            className="ai-input"
                            placeholder="Ask a question about your complaints or CCMS…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={typing}
                            rows={1}
                            aria-label="Message input"
                        />


                        <button
                            className="ai-send-btn"
                            onClick={() => sendMessage(input)}
                            disabled={!input.trim() || typing}
                            aria-label="Send message"
                        >

                            <Icon
                                size={18}
                                d={IC.send}
                            />

                        </button>

                    </div>


                    <p className="ai-input-hint">
                        Press Enter to send · Shift + Enter for new line
                    </p>

                </div>

            </div>

        </AppShell>
    );
}