"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { modes } from "@/features/ai/modes";
import { generateAIResponse } from "@/services/aiService";
import { saveChat } from "@/services/chatService";

export default function Dashboard() {
    const {
        messages, setMessages,
        chats, setChats,
        selectedChatId, setSelectedChatId,
    } = useChat();

    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedMode, setSelectedMode] = useState(modes[0]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);

        const newMessages = [
            ...messages,
            { role: "user" as const, content: prompt }
        ];
        setMessages(newMessages);
        setPrompt("");

        const result = await generateAIResponse(newMessages, selectedMode.id);

        const updatedMessages = [
            ...newMessages,
            { role: "assistant" as const, content: result }
        ];

        setMessages(updatedMessages);

        const savedChat = await saveChat(updatedMessages, selectedChatId);

        if (!selectedChatId) {
            setSelectedChatId(savedChat.id);
            setChats([savedChat, ...chats]);
        } else {
            setChats(chats.map((c) => c.id === savedChat.id ? savedChat : c));
        }

        setLoading(false);
    };

    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "#111",
            color: "white",
        }}>

            {/* MODE SELECTOR */}
            <div style={{
                padding: "16px 24px",
                borderBottom: "1px solid #1f1f1f",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
            }}>
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setSelectedMode(mode)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "20px",
                            border: `1px solid ${selectedMode.id === mode.id ? mode.color : "#2a2a2a"}`,
                            background: selectedMode.id === mode.id
                                ? `${mode.color}22`
                                : "transparent",
                            color: selectedMode.id === mode.id ? "white" : "#666",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: selectedMode.id === mode.id ? "600" : "400",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        {mode.icon} {mode.label}
                    </button>
                ))}
            </div>

            {/* MESSAGES AREA */}
            <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
            }}>

                {/* EMPTY STATE */}
                {messages.length === 0 && (
                    <div style={{
                        textAlign: "center",
                        marginTop: "60px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                    }}>
                        <div style={{ fontSize: "48px" }}>{selectedMode.icon}</div>
                        <p style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#777",
                        }}>
                            {selectedMode.label}
                        </p>
                        <p style={{ fontSize: "14px", color: "#444", maxWidth: "360px" }}>
                            {selectedMode.emptyStateText}
                        </p>

                        {/* QUICK PROMPTS */}
                        <div style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            marginTop: "8px",
                        }}>
                            {selectedMode.id === "general" && (
                                ["What is AI?", "Tips for productivity", "Explain REST API"].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => setPrompt(q)}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "20px",
                                            border: "1px solid #2a2a2a",
                                            background: "#1a1a1a",
                                            color: "#aaa",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))
                            )}
                            {selectedMode.id === "linkedin" && (
                                ["My journey as a developer", "Why I love TypeScript", "Lessons from my internship"].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => setPrompt(q)}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "20px",
                                            border: "1px solid #1d3d6b",
                                            background: "#0a1929",
                                            color: "#60a5fa",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))
                            )}
                            {selectedMode.id === "ideas" && (
                                ["SaaS product ideas", "Side project ideas for developers", "Content ideas for LinkedIn"].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => setPrompt(q)}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "20px",
                                            border: "1px solid #78350f",
                                            background: "#1c1007",
                                            color: "#fbbf24",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))
                            )}
                            {selectedMode.id === "code" && (
                                ["Explain useEffect", "What is async/await?", "Explain this React component"].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => setPrompt(q)}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "20px",
                                            border: "1px solid #064e3b",
                                            background: "#022c22",
                                            color: "#34d399",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* MESSAGES */}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                        }}
                    >
                        {msg.role === "assistant" && (
                            <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: selectedMode.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "14px",
                                marginRight: "10px",
                                flexShrink: 0,
                            }}>
                                {selectedMode.icon}
                            </div>
                        )}

                        <div style={{
                            background: msg.role === "user" ? selectedMode.color : "#1a1a1a",
                            padding: "12px 16px",
                            borderRadius: msg.role === "user"
                                ? "18px 18px 4px 18px"
                                : "18px 18px 18px 4px",
                            maxWidth: "65%",
                            fontSize: "14px",
                            lineHeight: "1.7",
                            border: msg.role === "assistant" ? "1px solid #2a2a2a" : "none",
                            whiteSpace: "pre-wrap",
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {/* LOADING */}
                {loading && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: selectedMode.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                        }}>
                            {selectedMode.icon}
                        </div>
                        <div style={{
                            background: "#1a1a1a",
                            padding: "12px 16px",
                            borderRadius: "18px 18px 18px 4px",
                            border: "1px solid #2a2a2a",
                            color: "#555",
                            fontSize: "14px",
                        }}>
                            {selectedMode.label} is thinking...
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* INPUT AREA */}
            <div style={{
                padding: "16px 24px",
                borderTop: "1px solid #1f1f1f",
                background: "#0f0f0f",
                display: "flex",
                gap: "12px",
                alignItems: "flex-end",
            }}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !loading) {
                            e.preventDefault();
                            handleGenerate();
                        }
                    }}
                    placeholder={selectedMode.placeholder}
                    rows={2}
                    style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: `1px solid ${selectedMode.color}44`,
                        background: "#1a1a1a",
                        color: "white",
                        fontSize: "14px",
                        outline: "none",
                        resize: "none",
                        lineHeight: "1.5",
                        fontFamily: "sans-serif",
                    }}
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    style={{
                        padding: "12px 20px",
                        borderRadius: "10px",
                        background: loading ? "#1a1a1a" : selectedMode.color,
                        color: "white",
                        border: "none",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        opacity: loading ? 0.5 : 1,
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                    }}
                >
                    {loading ? "..." : "Send →"}
                </button>
            </div>

        </div>
    );
}