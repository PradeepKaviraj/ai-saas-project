"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validation/auth";

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: any) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const text = await res.text(); // 👈 get raw response
            console.log("RAW RESPONSE:", text);

            try {
                const result = JSON.parse(text);
                alert(result.message);
            } catch {
                alert("Server returned non-JSON response. Check terminal.");
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };
    return (
        <div className="h-screen flex items-center justify-center bg-black">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-zinc-900 p-8 rounded-xl w-96 flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold">Login</h2>

                <div>
                    <input
                        {...register("email")}
                        placeholder="Email"
                        className="p-2 bg-zinc-800 rounded w-full"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="Password"
                        className="p-2 bg-zinc-800 rounded w-full"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                </div>

                <button className="bg-blue-500 p-2 rounded">Login</button>
            </form>
        </div>
    );
}