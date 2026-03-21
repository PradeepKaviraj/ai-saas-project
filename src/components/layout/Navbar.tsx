"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div style={{
      padding: "12px 24px",
      borderBottom: "1px solid #1f1f1f",
      background: "#0f0f0f",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <div>
        <span style={{ color: "#aaa", fontSize: "14px" }}>
          Welcome back 👋
        </span>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: "6px 16px",
          borderRadius: "6px",
          background: "transparent",
          color: "#f87171",
          border: "1px solid #7f1d1d",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500",
        }}
      >
        Logout
      </button>
    </div>
  );
}