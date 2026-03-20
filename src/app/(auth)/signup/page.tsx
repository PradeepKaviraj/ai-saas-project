"use client";

import { useForm } from "react-hook-form";

type FormData = {
    email: string;
    password: string;
};

export default function SignupPage() {
    const { register, handleSubmit } = useForm<FormData>();

    const onSubmit = async (data: any) => {
        try {
            const res = await fetch("/api/auth/signup", {
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
                <h2 className="text-xl font-bold text-white">Signup</h2>

                <input
                    {...register("email")}
                    placeholder="Email"
                    className="p-2 bg-zinc-800 rounded text-white"
                />
                <input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    className="p-2 bg-zinc-800 rounded text-white"
                />

                <button className="bg-green-600 hover:bg-green-700 p-2 rounded text-white font-medium">
                    Signup
                </button>
            </form>
        </div>
    );
}