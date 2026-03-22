import { Message, AIMode } from "@/types";

export async function generateAIResponse(
  messages: Message[],
  mode: AIMode
): Promise<string> {
  const res = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, mode }),
  });

  if (!res.ok) throw new Error("AI request failed");

  const data = await res.json();
  return data.result;
}