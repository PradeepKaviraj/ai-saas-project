import { ModeConfig } from "@/types";

export const modes: ModeConfig[] = [
    {
        id: "general",
        icon: "💬",
        label: "General Chat",
        placeholder: "Ask me anything...",
        color: "#2563eb",
        emptyStateText: "Ask me anything. I'm here to help.",
    },
    {
        id: "linkedin",
        icon: "💼",
        label: "LinkedIn Post",
        placeholder: "Enter a topic for your LinkedIn post...",
        color: "#0a66c2",
        emptyStateText: "Give me a topic and I'll write a professional LinkedIn post for you.",
    },
    {
        id: "ideas",
        icon: "💡",
        label: "Idea Generator",
        placeholder: "Enter a topic to brainstorm ideas...",
        color: "#d97706",
        emptyStateText: "Give me a topic and I'll brainstorm 5 creative ideas for you.",
    },
    {
        id: "code",
        icon: "🖥️",
        label: "Code Explainer",
        placeholder: "Paste your code here...",
        color: "#059669",
        emptyStateText: "Paste any code and I'll explain it in simple terms.",
    },
];