"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  // Get initials from email
  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
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

      {/* LEFT — Welcome */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>
          Welcome back 👋
        </span>
        <span style={{ color: "#555", fontSize: "12px" }}>
          {user?.email || "Loading..."}
        </span>
      </div>

      {/* RIGHT — Avatar + Logout */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>

        {/* AVATAR */}
        {user && (
          <div style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: "700",
            color: "white",
            border: "2px solid #1d4ed8",
          }}>
            {getInitials(user.email)}
          </div>
        )}

        {/* LOGOUT */}
        <button
          onClick={logout}
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
    </div>
  );
}