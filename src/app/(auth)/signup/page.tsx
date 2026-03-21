"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/lib/validation/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                router.push("/login");
            } else {
                alert(result.message);
            }
        } catch {
            alert("Something went wrong");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
        }}>

            {/* GLOW */}
            <div style={{
                position: "fixed",
                top: "20%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "600px",
                height: "300px",
                background: "radial-gradient(ellipse, rgba(5,150,105,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <div style={{
                width: "100%",
                maxWidth: "420px",
                padding: "0 16px",
                zIndex: 10,
            }}>

                {/* LOGO */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>⚡</div>
                    <h1 style={{
                        color: "white",
                        fontSize: "24px",
                        fontWeight: "700",
                        margin: 0,
                    }}>
                        AI SaaS
                    </h1>
                    <p style={{ color: "#555", fontSize: "14px", marginTop: "6px" }}>
                        Create your free account today.
                    </p>
                </div>

                {/* CARD */}
                <div style={{
                    background: "#111",
                    border: "1px solid #1f1f1f",
                    borderRadius: "16px",
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}>

                    <h2 style={{
                        color: "white",
                        fontSize: "18px",
                        fontWeight: "600",
                        margin: 0,
                    }}>
                        Create your account
                    </h2>

                    {/* EMAIL */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ color: "#aaa", fontSize: "13px" }}>Email</label>
                        <input
                            {...register("email")}
                            placeholder="you@example.com"
                            style={{
                                padding: "12px 14px",
                                borderRadius: "8px",
                                border: "1px solid #2a2a2a",
                                background: "#1a1a1a",
                                color: "white",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                        {errors.email && (
                            <p style={{ color: "#f87171", fontSize: "12px", margin: 0 }}>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ color: "#aaa", fontSize: "13px" }}>Password</label>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="••••••••"
                            style={{
                                padding: "12px 14px",
                                borderRadius: "8px",
                                border: "1px solid #2a2a2a",
                                background: "#1a1a1a",
                                color: "white",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                        {errors.password && (
                            <p style={{ color: "#f87171", fontSize: "12px", margin: 0 }}>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            background: isSubmitting ? "#065f46" : "#059669",
                            color: "white",
                            border: "none",
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                            fontWeight: "600",
                            fontSize: "15px",
                            opacity: isSubmitting ? 0.7 : 1,
                            transition: "all 0.2s",
                        }}
                    >
                        {isSubmitting ? "Creating account..." : "Create Account →"}
                    </button>

                    {/* DIVIDER */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}>
                        <div style={{ flex: 1, height: "1px", background: "#1f1f1f" }} />
                        <span style={{ color: "#444", fontSize: "12px" }}>or</span>
                        <div style={{ flex: 1, height: "1px", background: "#1f1f1f" }} />
                    </div>

                    {/* LOGIN LINK */}
                    <p style={{
                        textAlign: "center",
                        color: "#555",
                        fontSize: "14px",
                        margin: 0,
                    }}>
                        Already have an account?{" "}
                        <Link href="/login" style={{
                            color: "#60a5fa",
                            textDecoration: "none",
                            fontWeight: "500",
                        }}>
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* BOTTOM NOTE */}
                <p style={{
                    textAlign: "center",
                    color: "#333",
                    fontSize: "12px",
                    marginTop: "20px",
                }}>
                    Free forever · No credit card required
                </p>
            </div>
        </div>
    );
}