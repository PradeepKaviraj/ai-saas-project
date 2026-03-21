import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        // 🔥 GET TOKEN
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

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // 🔥 FETCH ONLY THIS USER'S CHAT
        const chat = await prisma.chat.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(chat);

    } catch (error) {
        console.error("FETCH CHAT ERROR:", error);
        return NextResponse.json(
            { message: "Failed to fetch chat" },
            { status: 500 }
        );
    }
}