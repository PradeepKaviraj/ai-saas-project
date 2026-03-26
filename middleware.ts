import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    // ❌ No token → redirect
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // ✅ Token exists → allow (skip verification in middleware)
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard"],
};