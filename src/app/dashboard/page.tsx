"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
    const [prompt, setPrompt] = useState("");

    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! How can I assist you today?" }
    ]);

    const [loading, setLoading] = useState(false);

    // 🔥 LOAD CHAT ON PAGE LOAD
    useEffect(() => {
        const loadChat = async () => {
            try {
                const res = await fetch("/api/chat/latest");
                const data = await res.json();

                if (data?.messages) {
                    setMessages(data.messages);
                }
            } catch (error) {
                console.error("Failed to load chat:", error);
            }
        };

        loadChat();
    }, []);

    const handleGenerate = async () => {
        if (!prompt) return;

        setLoading(true);

        const newMessages = [
            ...messages,
            { role: "user", content: prompt }
        ];

        const res = await fetch("/api/ai/generate", {
            method: "POST",
            body: JSON.stringify({ messages: newMessages }),
        });

        const data = await res.json();

        const updatedMessages = [
            ...newMessages,
            { role: "assistant", content: data.result }
        ];

        setMessages(updatedMessages);

        // 🔥 SAVE TO DATABASE
        await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({
                messages: updatedMessages,
            }),
        });

        setPrompt("");
        setLoading(false);
    };

    return (
        <div style={{
            color: "white",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            height: "100vh"
        }}>
            <h1>AI Chat</h1>

            {/* CHAT AREA */}
            <div style={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "20px"
            }}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            justifyContent:
                                msg.role === "user" ? "flex-end" : "flex-start",
                            marginBottom: "10px"
                        }}
                    >
                        <div
                            style={{
                                background:
                                    msg.role === "user" ? "#2563eb" : "#374151",
                                padding: "10px 15px",
                                borderRadius: "10px",
                                maxWidth: "70%"
                            }}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* INPUT AREA */}
            <div style={{
                display: "flex",
                gap: "10px"
            }}>
                <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type message..."
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "none"
                    }}
                />

                <button
                    onClick={handleGenerate}
                    style={{
                        padding: "10px 15px",
                        borderRadius: "8px",
                        background: "#2563eb",
                        color: "white",
                        border: "none"
                    }}
                >
                    {loading ? "Generating..." : "Send"}
                </button>
            </div>
        </div>
    );
}