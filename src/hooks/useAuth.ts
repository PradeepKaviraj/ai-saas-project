import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "@/types";

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch {
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    return { user, logout };
}