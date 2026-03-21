import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages) {
            return NextResponse.json(
                { message: "Prompt required" },
                { status: 400 }
            );
        }

        const completion = await client.chat.completions.create({
            model: "openrouter/free", // FREE model
            messages: [
                {
                    role: "system",
                    content: "You are an AI assistant inside a SaaS dashboard. You help users generate content like LinkedIn posts, ideas, and answers. Never say you are ChatGPT or mention OpenAI. Be concise and helpful."
                },
                ...messages
            ],
            temperature: 0.3,
        });

        const result = completion.choices[0].message.content;

        return NextResponse.json({ result });

    } catch (error) {
        console.error("AI ERROR:", error);
        return NextResponse.json(
            { message: "AI failed" },
            { status: 500 }
        );
    }
}