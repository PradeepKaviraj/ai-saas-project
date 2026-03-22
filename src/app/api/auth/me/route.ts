import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
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

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true }, // never return password
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);

    } catch (error) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}