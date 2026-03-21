import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        const cookie = req.headers.get("cookie");

        if (!cookie) {
            return NextResponse.json([]);
        }

        const token = cookie.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]?.trim();

        if (!token) {
            return NextResponse.json([]);
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;

        const chats = await prisma.chat.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(chats || []);

    } catch (error) {
        console.error("CHAT ALL ERROR:", error);

        // 🔥 ALWAYS RETURN ARRAY (VERY IMPORTANT)
        return NextResponse.json([]);
    }
}