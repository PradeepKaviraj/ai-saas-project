import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // 🔥 GET TOKEN FROM COOKIE
        const token = req.headers.get("cookie")?.split("token=")[1];

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }

        // 🔥 DECODE TOKEN
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.userId;

        // 🔥 SAVE CHAT WITH REAL USER
        const chat = await prisma.chat.upsert({
            where: {
                userId, // unique user
            },
            update: {
                messages, // update existing chat
            },
            create: {
                userId,
                messages,
            },
        });

        return NextResponse.json(chat);

    } catch (error) {
        console.error("SAVE CHAT ERROR:", error);
        return NextResponse.json(
            { message: "Failed to save chat" },
            { status: 500 }
        );
    }
}