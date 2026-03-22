import { Message, Chat } from "@/types";

export async function saveChat(
    messages: Message[],
    chatId: string | null
): Promise<Chat> {
    const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, chatId }),
    });

    if (!res.ok) throw new Error("Failed to save chat");

    return res.json();
}

export async function getAllChats(): Promise<Chat[]> {
    const res = await fetch("/api/chat/all");
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}


export async function deleteChat(chatId: string): Promise<boolean> {
    const res = await fetch("/api/chat/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId }),
    });

    return res.ok;
}