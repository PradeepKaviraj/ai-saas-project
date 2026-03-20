import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    // ❌ No token → redirect
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }

        jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Token valid → allow
        return NextResponse.next();

    } catch (error) {
        // ❌ Invalid token → redirect
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

// 👇 Protect only dashboard
export const config = {
    matcher: ["/dashboard"],
};