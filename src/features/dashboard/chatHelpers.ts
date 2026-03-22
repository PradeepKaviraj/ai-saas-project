import { Chat, Message } from "@/types";

export function getChatTitle(chat: Chat): string {
    const firstUserMsg = chat.messages?.find(
        (m: Message) => m.role === "user"
    );
    const title = firstUserMsg?.content || "New Chat";
    return title.length > 28 ? title.slice(0, 28) + "..." : title;
}

export function getDefaultMessages(): Message[] {
    return [
        {
            role: "assistant",
            content: "Hello! How can I assist you today?",
        },
    ];
}