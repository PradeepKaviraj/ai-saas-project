"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Message, Chat, ChatContextType } from "@/types";

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! How can I assist you today?" }
    ]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    useEffect(() => {
        const fetchChats = async () => {
            const res = await fetch("/api/chat/all");
            const data = await res.json();
            if (Array.isArray(data)) setChats(data);
        };
        fetchChats();
    }, []);

    const startNewChat = () => {
        setMessages([
            { role: "assistant", content: "Hello! How can I assist you today?" }
        ]);
        setSelectedChatId(null);
    };

    return (
        <ChatContext.Provider value={{
            messages, setMessages,
            chats, setChats,
            selectedChatId, setSelectedChatId,
            startNewChat,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be inside ChatProvider");
    return ctx;
};