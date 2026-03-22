import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function DELETE(req: Request) {
    try {
        const { chatId } = await req.json();

        const cookieHeader = req.headers.get("cookie") || "";
        const token = cookieHeader
            .split(";")
            .find((c) => c.trim().startsWith("token="))
            ?.split("=")[1]
            ?.trim();

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;

        // Make sure the chat belongs to this user
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
        });

        if (!chat || chat.userId !== userId) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        await prisma.chat.delete({
            where: { id: chatId },
        });

        return NextResponse.json({ message: "Deleted" });

    } catch (error) {
        console.error("DELETE CHAT ERROR:", error);
        return NextResponse.json({ message: "Failed" }, { status: 500 });
    }
}