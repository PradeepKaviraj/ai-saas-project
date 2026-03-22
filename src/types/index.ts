export interface Message {
    role: "user" | "assistant";
    content: string;
}

export interface Chat {
    id: string;
    userId: string;
    messages: Message[];
    createdAt: string;
}

export interface User {
    id: string;
    email: string;
}

export type AIMode = "general" | "linkedin" | "ideas" | "code";

export interface ModeConfig {
    id: AIMode;
    icon: string;
    label: string;
    placeholder: string;
    color: string;
    emptyStateText: string;
}

// 🔥 ADD THIS
export interface ChatContextType {
    messages: Message[];
    setMessages: (m: Message[]) => void;
    chats: Chat[];
    setChats: (c: Chat[]) => void;
    selectedChatId: string | null;
    setSelectedChatId: (id: string | null) => void;
    startNewChat: () => void;
}