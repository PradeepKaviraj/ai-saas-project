import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { messages, chatId } = await req.json();

        const cookieHeader = req.headers.get("cookie") || "";
        const token = cookieHeader.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]?.trim();

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;

        // UPDATE existing chat
        if (chatId) {
            const updated = await prisma.chat.update({
                where: { id: chatId },
                data: { messages },
            });
            return NextResponse.json(updated);
        }

        // CREATE new chat
        const chat = await prisma.chat.create({
            data: { userId, messages },
        });

        return NextResponse.json(chat);

    } catch (error) {
        console.error("SAVE CHAT ERROR:", error);
        return NextResponse.json({ message: "Failed" }, { status: 500 });
    }
}