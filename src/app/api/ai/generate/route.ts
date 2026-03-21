import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

// 🧠 SYSTEM PROMPTS PER MODE
const systemPrompts: Record<string, string> = {
    general: `You are a helpful AI assistant inside a SaaS dashboard. 
Be concise, clear, and friendly. Never say you are ChatGPT or mention OpenAI.`,

    linkedin: `You are a professional LinkedIn content writer. 
When given a topic, generate an engaging, professional LinkedIn post.
Format: Start with a strong hook, add value in the body, end with a call to action.
Use line breaks for readability. Add 3-5 relevant hashtags at the end.
Never say you are ChatGPT or mention OpenAI.`,

    ideas: `You are a creative idea generator and brainstorming expert.
When given a topic, generate 5 unique, creative, and actionable ideas.
Format each idea with a title and 1-2 sentence explanation.
Be creative, practical, and inspiring.
Never say you are ChatGPT or mention OpenAI.`,

    code: `You are an expert software engineer and code explainer.
When given code, explain it in simple, clear terms step by step.
Break down what each part does, why it exists, and how it works.
Use simple language — explain as if talking to a junior developer.
Never say you are ChatGPT or mention OpenAI.`,
};

export async function POST(req: Request) {
    try {
        const { messages, mode } = await req.json();

        if (!messages) {
            return NextResponse.json(
                { message: "Messages required" },
                { status: 400 }
            );
        }

        // Pick system prompt based on mode (default: general)
        const systemPrompt = systemPrompts[mode] || systemPrompts.general;

        const completion = await client.chat.completions.create({
            model: "openrouter/free",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
            temperature: 0.7,
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